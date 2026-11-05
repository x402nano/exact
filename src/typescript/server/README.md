# Resource Server

The **`Resource Server`** component defines payment requirements for a resource (e.g. API, content), and delivers the resource to **`Client`** on successful payment.

Important code snippets are below. See [usage example](https://github.com/x402nano/exact/blob/main/src/typescript/examples/example-server.mjs) for a more complete code example.

First make necessary imports.
```js
import { ExactNanoServerScheme } from "@x402nano/exact";
import { x402ResourceServer, HTTPFacilitatorClient } from "@x402/core/server";
```

### Register Resource Server

Create instance of the **`Resource Server`** `exact` scheme implementation.
```js
const exactNanoServerScheme = new ExactNanoServerScheme();
```

Register the Nano network that the **`Resource Server`** can create payment requirements for. Also pass the scheme instance just created.
```js
const resourceServer = new x402ResourceServer(new HTTPFacilitatorClient({ url: /* Facilitator URL */ }));
resourceServer.register("nano:mainnet", exactNanoServerScheme);
```
