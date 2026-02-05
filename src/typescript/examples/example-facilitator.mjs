/*
------------------------------------------------
Facilitator example code for x402 Nano implementations
------------------------------------------------

A Facilitator verifies and settles payments created by a Client.

A Resource Server passes along the CLient's payment payload
to an Facilitator hosted elsewhere or hosts the Facilitator
itself.

A Facilitator exposes three endpoints:
- /verify: Verify the Client's payment payload (i.e. Nano send block)
- /settle: Settle the Client's payment payload (i.e. process the Nano send block on the Nano network)
- /supported: Returns the networks which this Facilitator supports

------------------------------------------------
*/

import { x402Facilitator } from '@x402/core/facilitator'
import { ExactNanoScheme } from '@x402nano/exact/facilitator'
import { Helper } from '@x402nano/helper'
import express from 'express'
import 'dotenv/config'

// Nano RPC is required for the Facilitator to function
if (!process.env.NANO_RPC_URL) {
  throw new Error('NANO_RPC_URL environment variable not set in .env file')
}

const app = express()
app.use(express.json())
 
// ---------------------------------------------------
// FACILITATOR SETUP

// Create x402Facilitator instance from x402 protocol core code.
const facilitator = new x402Facilitator()

// Create instance of Helper that will help with Nano RPC communication.
// Pass in configuration object with the URL of the Nano RPC to use for Nano network communication.
const helper = new Helper({
  NANO_RPC_URL: process.env.NANO_RPC_URL
})

// Create instance of the implementation of the x402 Nano "exact" payment scheme for x402 Facilitator.
// Pass in Helper instance just created.
const exactNanoScheme = new ExactNanoScheme(helper)

// Register the Nano mainnet as a network that the x402 Facilitator verifies and settles transactions for.
// Also pass the scheme instance just created.
facilitator.register('nano:mainnet', exactNanoScheme)

// Optional: hooks to log verify/settle attempts.
facilitator
  .onBeforeVerify((context) => {
    console.log('Verifying payment...')
  })
  .onAfterVerify((context) => {
    console.log('✅ Verify result:', context.result)
    if (context.result.isValid) {
      console.log(`✅ Payment verified successfully`)
    } else {
      console.log(`❌ Payment verification failed. (Error: ${context.result.invalidReason})`)
    }    
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

// ---------------------------------------------------
// ENDPOINT CREATION

// Create the /verify endpoint of the Facilitator.
app.post('/verify', async (req, res) => {
  console.log('---------------------------------------------------')
  console.log('Received /verify request:')

  // Endpoint will be passed in paymentPayload and paymentRequirements from the Resource Server.
  const { paymentPayload, paymentRequirements } = req.body

  // Facilitator attempts to verify the payment before eventual settlement (verifies block contents, performs balance check etc..).
  let verifyResult = await facilitator.verify(paymentPayload, paymentRequirements)

  res.json(verifyResult)
})

// -----

// Create the /verify endpoint of the Facilitator.
app.post('/settle', async (req, res) => {
  console.log('---------------------------------------------------')
  console.log('Received /settle request:')

  // Endpoint will be passed in paymentPayload and paymentRequirements from the Resource Server.
  const { paymentPayload, paymentRequirements } = req.body

  // Facilitator attempts to settle the payment (i.e. process the Nano send block on the Nano network).
  let settleResult = await facilitator.settle(paymentPayload, paymentRequirements)

  res.json(settleResult)
})


// -----

// Create the /supported endpoint of the Facilitator.
app.get('/supported', (req, res) => {  

  try {

    const response = facilitator.getSupported()

    res.json(response)
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }

})

// ---------------------------------------------------

const facilitatorPort = process.env.FACILITATOR_PORT

// Nano RPC is required for the Facilitator to function
if (!facilitatorPort) {
  throw new Error('FACILITATOR_PORT environment variable not set in .env file')
}

app.listen(facilitatorPort, () => {
  console.log('---------------------------------------------------')
  console.log(`Facilitator listening at http://localhost:${facilitatorPort}`)
})