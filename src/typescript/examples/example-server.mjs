/*
------------------------------------------------
Resource Server example code for x402 Nano implementations
------------------------------------------------

A Resource Server defines Payment Requirements for a resource (e.g. API, article content).
It receives a Payment Payload from a Client for the resource and communicates with 
a Facilitator to verify and process the Payment Payload.

After a Payment Payload is processed, the Resource Server communicates the resulting
confirmation hash back to the Client.

------------------------------------------------
*/

import express from "express"
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server"
import { ExactNanoScheme } from "@x402nano/exact/server"
import 'dotenv/config'

// Define the endpoints that will be protected behind a 402 Payment required paywall
const endpointConfigs = {
  [`GET ${process.env.RESOURCE_PATH}`]: {
    scheme: "exact",
    network: "nano:mainnet",
    // price can be in raw units (e.g. 100000000000000000000000000) or use decimal for nano units (e.g. 0.0001)
    price: process.env.PAYMENT_REQUIREMENT_AMOUNT,
    payTo: process.env.PAYMENT_REQUIREMENT_PAY_TO,
    description: "Resource to pay for",
    mimeType: "application/json",
  },

  //... add more endpoint configs here, strictly follow the format of the example above

  // more examples...
  /*   
  [`GET /resource-to-pay-for-1`]: {
    scheme: "exact",
    network: "nano:mainnet",    
    price: "100000000000000000000000000",
    payTo: "nano_1...",
    description: "Resource to pay for (#1)",
    mimeType: "application/json",
  },  
  [`GET /resource-to-pay-for-2`]: {
    scheme: "exact",
    network: "nano:mainnet",    
    price: "0.0001",   // parses automatically to 100000000000000000000000000 raw units
    payTo: "nano_1...",
    description: "Resource to pay for (#2)",
    mimeType: "application/json",
  }, 
  */
}


const facilitator = new HTTPFacilitatorClient({ url: `http://localhost:${process.env.FACILITATOR_PORT}` })
const resourceServer = new x402ResourceServer(facilitator)

const exactNanoSchema = new ExactNanoScheme()

resourceServer.register( "nano:mainnet", exactNanoSchema)

// Optional: add logging / hooks for verification and settlement of payment payloads
resourceServer
  .onBeforeVerify((context) => {
    console.log('Verifying payment...')
  })
  .onAfterVerify((context) => {
    console.log("✅ Payment verified successfully")
  })
  .onVerifyFailure((context) => {
    console.log('❌ Payment verification failed')
  })
  .onBeforeSettle((context) => {
    console.log('Settling payment...')
  })
  .onAfterSettle((context) => {
    if (context.result.success) {
      console.log(`✅ Payment settled successfully (Hash: ${context.result.transaction})`)
    } else {
      console.log(`❌ Payment settlement failed. (Error: ${context.result.errorReason})`)
    }
  })
  .onSettleFailure((context) => {
    console.log('❌ Payment settlement failed')
  })    

async function resourceServerMiddleware(req, res, next) {  
  
  const endpointKey = `${req.method} ${req.path}`
  const endpointConfig = endpointConfigs[endpointKey]  

  // If endpoint doesn't require payment, continue
  if (!endpointConfig) {
    return next()
  }  

  const paymentRequirements = (await resourceServer.buildPaymentRequirements(endpointConfig))[0]

  // Step 1: Check for payment in headers
  const paymentHeader = (req.headers["payment-signature"] || req.headers["PAYMENT-SIGNATURE"] || req.headers["x-payment"])  

  if (!paymentHeader) {
    console.log(`Received request for resource ${req.path}`)

    // Step 2: Return 402 with payment requirements
    const paymentRequired = await resourceServer.createPaymentRequiredResponse([paymentRequirements], {
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      description: endpointConfig.description,
      mimeType: endpointConfig.mimeType,
    })

    // Use base64 encoding for the PAYMENT-REQUIRED header (V2 protocol)
    const paymentRequiredHeader = Buffer.from(JSON.stringify(paymentRequired)).toString("base64")    

    res.status(402)
    res.set("PAYMENT-REQUIRED", paymentRequiredHeader)
    res.json({
      error: "Payment Required",
      message: "This endpoint requires payment",
    })
    return
  }

  try {
    const paymentPayload = JSON.parse(Buffer.from(paymentHeader, "base64").toString("utf-8"))

    const verifyResult = await resourceServer.verifyPayment(paymentPayload, paymentRequirements)

    if (!verifyResult.isValid) {
      console.log(`❌ Payment verification failed: ${JSON.stringify(verifyResult)}`)
      res.status(402).json({
        error: "Invalid Payment",
        reason: verifyResult.invalidReason,
      })
      return
    }    

    const settleResult = await resourceServer.settlePayment(paymentPayload, paymentRequirements)  

    if (!settleResult.success) {
      res.status(402).json({
        error: "Invalid Payment",
        reason: settleResult.errorReason,
      })
      return
    }

    // Add the settlement header directly to the response object
    const settlementHeader = Buffer.from(JSON.stringify(settleResult)).toString("base64")

    res.set("PAYMENT-RESPONSE", settlementHeader)

    console.log('---------------------------------------------------')
    next()

  } catch (error) {
    console.error(`❌ Payment processing error: ${error}`, error)
    res.status(500).json({
      error: "Payment Processing Error",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}  

// Create Express app
const app = express()

// Apply custom payment middleware
app.use(resourceServerMiddleware)

// Protected endpoint, needs payment to unlock
app.get(process.env.RESOURCE_PATH, (req, res) => {
  res.json({
    data : "Here is your paid content!",
    timestamp: new Date().toISOString(),
  })
}) 

console.log('---------------------------------------------------')

;(async function () {
  try {
    // Initialize the Resource Server (sync with Facilitator) before starting
    await resourceServer.initialize()

    app.listen(process.env.RESOURCE_SERVER_PORT, () => {
      console.log(`Resource Server listening at http://localhost:${process.env.RESOURCE_SERVER_PORT}\n`)
    })    
  } catch (error) {
    console.log(error)
  }
})()
