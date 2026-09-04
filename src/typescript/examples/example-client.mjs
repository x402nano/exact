/*
------------------------------------------------
Client example code for x402 Nano implementations
------------------------------------------------

A Client handles Payment Requirements returned by a Resource Server.

The Client creates a Payment Payload that satisfies the Payment Requirements.
The payload contains a Nano send block.

The Client does not process the Nano send block on the Nano network itself. Instead it
sends the Payment Payload (containing the Nano send block) to the Resource Server
which then has an Facilitator verify and process the Nano send block contained
within the Payment Payload.

------------------------------------------------
*/

import { x402Client, x402HTTPClient } from "@x402/core/client"
import { ExactNanoScheme } from "@x402nano/exact/client"
import { Helper } from '@x402nano/helper'
import 'dotenv/config'

const RESOURCE_URL = `http://localhost:${process.env.RESOURCE_SERVER_PORT}${process.env.RESOURCE_PATH}`

// ---------------------------------------------------

async function main() {

  // Create x402Client instance from x402 protocol core code.
  const client = new x402Client()

  // Create instance of Helper that will help with Nano RPC communication.
  // Pass in configuration object with the URL of the Nano RPC to use for Nano network communication,
  // the URL of the Nano work generator (if blank will default to Nano RPC URL), and the private key 
  // of the Nano account to create a send block for.
  const helper = new Helper({
    NANO_ACCOUNT_PRIVATE_KEY: process.env.CLIENT_NANO_ACCOUNT_PRIVATE_KEY,
    NANO_RPC_URL: process.env.NANO_RPC_URL,  
    NANO_WORK_GENERATION_URL: process.env.NANO_WORK_GENERATION_URL
  })

  // Optional: add logging / hooks for work generation.
  helper
    .onBeforeWorkGeneration((context) => {console.log('Generating work...')})
    .onAfterWorkGeneration((context) => {console.log('✅ Work generated')}) 

  // Create instance of the implementation of the x402 Nano "exact" payment scheme for x402 Client.
  // Pass in Helper instance just created.
  const exactNanoScheme = new ExactNanoScheme(helper)  

  // Register the Nano mainnet as a network that the x402 Client can create Payment Payloads for.
  // Also pass the scheme instance just created.
  client.register('nano:mainnet', exactNanoScheme)

  // Configure client to only create Nano payments
  client.setSpendControls({
    allowedAssets: [{ network: 'nano:mainnet', asset: 'XNO' }],
  })

  // Optional: add logging / hooks for payment payload creation.
  client
    .onBeforePaymentCreation((context) => {
      console.log(`Preparing payment for ${context.paymentRequired.resource.url} ...`)
    })
    .onAfterPaymentCreation((context) => {
      console.log('✅ Payment payload created')
    })
    .onPaymentCreationFailure((err) => {
      console.error('❌ Payment creation failed:')
    })

  // HTTP transport layer
  const httpClient = new x402HTTPClient(client)

  console.log('---------------------------------------------------')  

  // Step 1: Make initial request
  let initialResponse = await fetch(RESOURCE_URL)
  
  if (initialResponse.status === 402) {
    const getHeaderFromInitialResponse = (name) => initialResponse.headers.get(name)
  
    const paymentRequiredResponse = await httpClient.getPaymentRequiredResponse(getHeaderFromInitialResponse)
    const paymentPayload = await httpClient.createPaymentPayload(paymentRequiredResponse)
    const paymentSignatureHeader = httpClient.encodePaymentSignatureHeader(paymentPayload)
  
    // Step 2: Retry with PAYMENT-SIGNATURE header
    const retryResponse = await fetch(RESOURCE_URL, {
      headers: paymentSignatureHeader,
    })
    // Step 3: Handle success
    if (retryResponse.status === 200) {
      
      const getHeaderFromRetryResponse = (name) => retryResponse.headers.get(name)
      const settlement = httpClient.getPaymentSettleResponse(getHeaderFromRetryResponse)

      if (settlement.success) {
        console.log("✅ Settlement:")
        console.log(`  Transaction: ${settlement.transaction}`)
        console.log(`  Payer: ${settlement.payer}`)
        console.log(`  Network: ${settlement.network}`)
    
        console.log('✅ Unlocked content:\n', await retryResponse.json())
      } else {
        console.log('❌ Payment failed, error: ', retryResponse.errorReason)
      }
  
    } else {
      console.log('❌ Payment failed, status', retryResponse.status)
    }
  } else {
    console.warn(`Resource Server endpoint (${RESOURCE_URL}) didn\'t return a 402 Payment required response`)
  }


}

main().catch(error => {
  console.error("\n❌ Error:", error, error.message)
  process.exit(1)
})