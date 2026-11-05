# Facilitator

The **`Facilitator`** component verifies and settles payments for a **`Resource Server`**.

Important code snippets are below. See [usage example](https://github.com/x402nano/exact/blob/main/src/typescript/examples/example-facilitator.mjs) for a more complete code example.

First make necessary imports.
```js
import { ExactNanoFacilitatorScheme, createFacilitatorNanoSigner } from "@x402nano/exact";
import { x402Facilitator } from "@x402/core/facilitator";
```

### 1. Create Signer (Required Step)

Use `createFacilitatorNanoSigner` to create an instance of Signer class that will enable Nano RPC communication and work generation for **`Facilitator`**. 

```js
const signer = createFacilitatorNanoSigner({
  rpcUrl: process.env.NANO_RPC_URL,
  rpcApiKey: process.env.NANO_RPC_API_KEY,
  workGenerationUrl: process.env.NANO_WORK_GENERATION_URL,
  workGenerationApiKey: process.env.NANO_WORK_GENERATION_API_KEY,
});
```

The configuration object to pass into `createFacilitatorNanoSigner` has the following shape:
```js
{
  rpcUrl: "https://...", // REQUIRED - URL of Nano node RPC endpoint
  rpcApiKey: "LPb5P...CWiqw", // OPTIONAL - Bearer authentication token if needed for access to Nano node RPC URL
  workGenerationUrl: "https://...", // OPTIONAL - URL of work generation endpoint 
  workGenerationApiKey: "tG0nH...asRgk" // OPTIONAL - Bearer authentication token if needed for access to work generation URL
  workGenerator: function (block, network) {/* ...generate work here... */} // OPTIONAL - Custom work generation function
}
```

### 2. Configure Work Generation (Optional Step)

If **`Facilitator`** should offer work generation for **`Clients`**, it must configure either `workGenerationUrl` or `workGenerator` in the Signer configuration (`workGenerator` will take precendence if both are configured) in order to generate work for the send block in the payment payload.

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

### 3. Register Facilitator (Required Step)

Create instance of the **`Facilitator`** `exact` scheme implementation. Pass in Signer class instance just created.
```js
const exactNanoFacilitatorScheme = new ExactNanoFacilitatorScheme(signer);
```

Register the Nano network that the **`Facilitator`** verifies and settles transactions for. Also pass the scheme instance just created.
```js
const facilitator = new x402Facilitator();
facilitator.register("nano:mainnet", exactNanoFacilitatorScheme);
```

---

> ⚠️ Note for users of the deprecated `@x402nano/helper` package - provide the older style configuration object to `fromHelperConfig` when using `createFacilitatorNanoSigner`. This will convert into the newer configuration object shape before creating the Signer class.

```js
import { ExactNanoFacilitatorScheme, createFacilitatorNanoSigner, fromHelperConfig /* <- import needed */ } from "@x402nano/exact";

const signer = new createFacilitatorNanoSigner(fromHelperConfig({
  NANO_ACCOUNT_PRIVATE_KEY: process.env.CLIENT_NANO_ACCOUNT_PRIVATE_KEY,
  NANO_RPC_URL: process.env.NANO_RPC_URL,  
  NANO_WORK_GENERATION_URL: process.env.NANO_WORK_GENERATION_URL
}));
```

[work_generate]: https://docs.nano.org/commands/rpc-protocol/#work_generate