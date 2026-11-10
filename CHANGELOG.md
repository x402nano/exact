# Changelog

## v1.0.0

`@x402nano/exact` **v1.0.0** introduces a wide codebase change to match the much improved [exact scheme](https://github.com/x402nano/schemes/blob/main/exact.md) for Nano payments.

### 🚨 **Breaking Changes**

- Custom `workGenerator` function parameters have changed. The new function signature takes two parameters `block` and `network`, as opposed to the older `hash` parameter. See the READMEs for [Client](https://github.com/x402nano/exact/blob/main/src/typescript/client/) and [Facilitator](https://github.com/x402nano/exact/blob/main/src/typescript/facilitator/) for more details.
- The location of `.env.example` (and consequently `.env`) for tests and example scripts execution has moved to the root directory of the project.

### ⚠️ **Deprecations**

- Packages `@x402nano/helper` and `@x402nano/typescript-common` are now deprecated and no longer dependencies of `@x402nano/exact`. Their functionality has been combined into the `@x402nano/exact` package (three separate packages vs. one package = easier maintainability).
- `Helper` has been deprecated and replaced with `Signer`. Use [createClientNanoSigner](https://github.com/x402nano/exact/blob/main/src/typescript/client/#create-signer-required-step) and [createFacilitatorNanoSigner](https://github.com/x402nano/exact/blob/main/src/typescript/facilitator/#create-signer-required-step) to create the `Signer` instance for your chosen component (**`Client`** or **`Facilitator`**).
- Error code `error_invalid_helper` is removed due to deprecation of package `@x402nano/helper`.

### 🗨️ **Other Changes**
- Settlement by **`Facilitator`** has been strengthened. Now waits for send blocks to be confirmed rather than just broadcast to the network.
- Verification of payment payloads by **`Facilitator`** has become stricter. More granular error codes returned to match the [Nano exact scheme](https://github.com/x402nano/schemes/blob/main/exact.md).
- Set an API key (Bearer token) for Nano RPC endpoint and Work Generation endpoint via `Signer` config fields `rpcApiKey` and `workGenerationApiKey` respectively.
- `fromHelperConfig` utility function added to convert deprecated `Helper`config to new `Signer` config shape for [Client](https://github.com/x402nano/exact/blob/main/src/typescript/client/#deprecation-notice) and [Facilitator](https://github.com/x402nano/exact/blob/main/src/typescript/facilitator/#deprecation-notice).
- More unit testing added for better code coverage.
- Integration test added to test live transactions on the Nano network.
- READMEs added for each component - [Client](https://github.com/x402nano/exact/blob/main/src/typescript/client/), [Resource Server](https://github.com/x402nano/exact/blob/main/src/typescript/server/), and [Facilitator](https://github.com/x402nano/exact/blob/main/src/typescript/facilitator/).
- Package updates for `zod`, `nano-sdk` and `bignumber.js`.

### ✍️ **Notes**
- Due to Verification and Settlement changes, the **`Facilitator`** now makes more RPC calls to a Nano node endpoint. Please monitor your Nano node RPC usage to avoid running into usage quota restrictions.
