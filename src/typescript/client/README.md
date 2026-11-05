# Client

The **`Client`** component creates a payment payload (which includes a Nano send block) to satisfy a payment requirement returned by a **`Resource Server`**.

Important code snippets are below. See [usage example](https://github.com/x402nano/exact/blob/main/src/typescript/examples/example-client.mjs) for a more complete code example.

First make necessary imports.
```js
import { ExactNanoClientScheme, createClientNanoSigner } from "@x402nano/exact";
import { x402Client, x402HTTPClient } from "@x402/core/client";
```

### 1. Create Signer (Required Step)

Use `createClientNanoSigner` to create an instance of Signer class that will enable Nano RPC communication and work generation. 

```js
const signer = createClientNanoSigner({
  accountPrivateKey: process.env.CLIENT_NANO_ACCOUNT_PRIVATE_KEY,
  rpcUrl: process.env.NANO_RPC_URL,
  rpcApiKey: process.env.NANO_RPC_API_KEY,
  workGenerationUrl: process.env.NANO_WORK_GENERATION_URL,
  workGenerationApiKey: process.env.NANO_WORK_GENERATION_API_KEY,
});
```

The configuration object to pass into Signer has the following shape:
```js
{
  accountPrivateKey: "2CEA2...AB3BC", // REQUIRED - 64-character hexidecimal Nano account private key (🚨 not wallet seed 🚨)
  rpcUrl: "https://...", // REQUIRED - URL of Nano node RPC endpoint
  rpcApiKey: "LPb5P...CWiqw", // OPTIONAL - Bearer authentication token if needed for access to Nano node RPC URL
  workGenerationUrl: "https://...", // OPTIONAL - URL of work generation endpoint 
  workGenerationApiKey: "tG0nH...asRgk" // OPTIONAL - Bearer authentication token if needed for access to work generation URL
  workGenerator: function (block, network) {/* ...generate work here... */} // OPTIONAL - Custom work generation function
}
```

### 2. Configure Work Generation

**`Client`** can configure either `workGenerationUrl` or `workGenerator` in the Signer configuration (`workGenerator` will take precendence if both are configured) in order to generate work for the send block in the payment payload.

> **Note**: Work generation configuration is optional if `Resource Server` has included `extra.workOptional:true` in the payment requirement. If not configuring work generation, omit the `workGenerationUrl`, `workGenerationApiKey` and `workGenerator` fields from the Signer configuration object.

`workGenerationUrl` must be an endpoint implementing a `work_generate` POST action matching that of the Nano node RPC equivalent, or a Nano node RPC endpoint itself.

`workGenerator` takes a custom function that offers more flexibility for work generation. It takes two parameters (`block` and `network`) and must return the generated `work` value. Parameters to the `workGenerator` custom function will be passed in at runtime.
- PARAMETER `block` - The send block from the payment payload. Work should be generated using `block.previous` as input, which is the hash of the frontier block of the payer's Nano account. Alternatively the Nano RPC action [work_generate] can take `block` as a parameter and will try to calculate the appropriate difficulty threshold based on ledger data, avoiding the task of determining the difficulty threshold for work generation from the `network` parameter below.
- PARAMETER `network` - The Nano network being used. Can be used to determine the difficulty threshold for work generation. For example send blocks on `nano:mainnet` need work generated at a current difficulty threshold of `fffffff800000000`.
- RETURNS `work` - Generated work value.

Pseudocode example:
```js
import { generateNanoWorkUsingGPU } from "NanoWorkGenerationLibrary"; // for illustration purposes, not a real library

const myWorkGenerator = async function (block, network) {
  let work = await generateNanoWorkUsingGPU(block.previous);
  returns work;
}

// then pass myWorkGenerator into the `workGenerator` field of the configuration object for `createFacilitatorNanoSigner`
```

Optional: add lifecycle hooks for work generation.
```js
signer
  .onBeforeWorkGeneration(({ hash }) => {console.log(`Generating work for ${hash}`)})
  .onAfterWorkGeneration(({ hash, work }) => {console.log(`✅ Work value ${work} generated for ${hash}`)});
```

When `onBeforeWorkGeneration` is triggered it is passed an object with one field:
- `hash` - The 64-character hexadecimal value to generate work for

When `onAfterWorkGeneration` is triggered it is passed an object with two fields:
- `hash` - The 64-character hexadecimal value work was generated for
- `work` - The work generated for `hash`

### 3. Register Client (Required Step)

Create instance of the **`Client`** `exact` scheme implementation. Pass in Signer class instance just created.
```js
const exactNanoClientScheme = new ExactNanoClientScheme(signer);
```

Register the Nano network that the **`Client`** can create payment payloads for. Also pass the scheme instance just created.
```js
const client = new x402Client();
client.register("nano:mainnet", exactNanoClientScheme);
```

Configure **`Client`** to only create Nano payments on your chosen Nnao network e.g. `nano:mainnet`.
```js
client.setSpendControls({
  allowedAssets: [{ network: "nano:mainnet", asset: "XNO" }],
});
```

---

> ⚠️ Note for users of the deprecated `@x402nano/helper` package - provide the older style configuration object to `fromHelperConfig`. This will convert into the newer configuration object shape before creating the Signer class.

```js
import { ExactNanoClientScheme, createClientNanoSigner, fromHelperConfig /* <- import needed */ } from "@x402nano/exact";

const signer = new createClientNanoSigner(fromHelperConfig({
  NANO_ACCOUNT_PRIVATE_KEY: process.env.CLIENT_NANO_ACCOUNT_PRIVATE_KEY,
  NANO_RPC_URL: process.env.NANO_RPC_URL,  
  NANO_WORK_GENERATION_URL: process.env.NANO_WORK_GENERATION_URL
}));
```

[work_generate]: https://docs.nano.org/commands/rpc-protocol/#work_generate