import { vi } from "vitest";
import { CURRENCY_CODE_XNO } from "../../constants";

export const SUPPORTED_X402_VERSION = 2;
export const UNSUPPORTED_X402_VERSION = 999;
export const UNSUPPORTED_ASSET = "ONX";
export const UNSUPPORTED_NETWORK = "raiblocks:mainnet";
export const SCHEME = "exact";
export const NETWORK: `${string}:${string}` = "nano:mainnet";
export const PAYMENT_ID = "0262ee8c-d848-438c-93df-52db6000e483";

// -----

export const ROUTE_URL_A = "/sample-route-a";
export const ROUTE_URL_B = "/sample-route-b";
export const MOCK_ROUTE_A_KEY = "GET " + ROUTE_URL_A;
export const MOCK_ROUTE_B_KEY = "GET " + ROUTE_URL_B;
export const MOCK_BASE_URL = "https://premium-api.com";

export const MOCK_ROUTES = {
  [MOCK_ROUTE_A_KEY]: {
    scheme: SCHEME,
    network: NETWORK,
    price: "100000000000000000000000000",
    payTo: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
    description: "Premium content at /sample-route-a",
    mimeType: "application/json",
    maxTimeoutSeconds: 120,
  },
  [MOCK_ROUTE_B_KEY]: {
    scheme: SCHEME,
    network: NETWORK,
    price: "0.001",
    payTo: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
    description: "Premium content at /sample-route-b",
    mimeType: "application/json",
    maxTimeoutSeconds: 120,
  },
};

export const MOCK_RESOURCE_A = {
  url: MOCK_BASE_URL + ROUTE_URL_A,
  description: MOCK_ROUTES[MOCK_ROUTE_A_KEY].description,
  mimeType: MOCK_ROUTES[MOCK_ROUTE_A_KEY].mimeType,
};

// -----

export const MOCK_SEND_BLOCK = {
  type: "state",
  account: "nano_1dz4mfgu5a1iq1zmnfcui1kwuno3nw9togicmmszm4ci7w51nqjd3sbej48e",
  previous: "6DA647EA687DC1F5E9C16D1ED200D4DE1EB645DF24448FC4A8F77C6D82D706AC",
  representative: "nano_3chartsi6ja8ay1qq9xg3xegqnbg1qx76nouw6jedyb8wx3r4wu94rxap7hg",
  balance: "126888409999999999999876600000",
  link: "3C64F70AA4866905632537314E3CE21B0210499DB17A4F335F9E3CE2C59D3BF8",
  link_as_account: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
  signature:
    "CDD6791BD5421134E55BD18CA792C6AC8C5DF8721B1501CBFF3FED7F12370C090091B3401562DCA13D3D5D77705BC1E10B0C76E5C4DC9A4D628428EB149FD101",
  work: "5112cd36bb3270be",
};

// -----

export const MOCK_SETTLED_BLOCK_HASH =
  "E2FB233EF4554077A7BF1AA85851D5BF0B36965D2B0FB504B2BC778AB89917D3";

// -----

export const MOCK_BLOCK_INFO_BLOCK_ALREADY_EXISTS = vi.fn().mockResolvedValue({
  block_account: "nano_1dz4mfgu5a1iq1zmnfcui1kwuno3nw9togicmmszm4ci7w51nqjd3sbej48e",
  amount: "100000000000000000000000000",
  balance: "126688409999999999999876600000",
  height: "876",
  local_timestamp: "1787341881",
  successor: "0000000000000000000000000000000000000000000000000000000000000000",
  confirmed: "true",
  contents: {
    type: "state",
    account: "nano_1dz4mfgu5a1iq1zmnfcui1kwuno3nw9togicmmszm4ci7w51nqjd3sbej48e",
    previous: "D88F4D4CF4B03BCC1B77D409F7DE83277CB09BBFDA7220242E281BFC780E85D1",
    representative: "nano_3chartsi6ja8ay1qq9xg3xegqnbg1qx76nouw6jedyb8wx3r4wu94rxap7hg",
    balance: "126688409999999999999876600000",
    link: "3C64F70AA4866905632537314E3CE21B0210499DB17A4F335F9E3CE2C59D3BF8",
    link_as_account: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
    signature:
      "5342DCBEFAEE17CC7CF854F2529D2998093F92591D8D9FC870B51EEF667F630F3EBE52E69330EA4E272E509061C3D8E6CDF059E092A0B11B4D672E779868E50A",
    work: "e437fa4e7dcf404f",
  },
  subtype: "send",
});

export const MOCK_BLOCK_INFO_BLOCK_NOT_FOUND = vi.fn().mockResolvedValue({
  error: "Block not found",
});

// -----

const GET_ACCOUNT_INFO = {
  frontier: "6DA647EA687DC1F5E9C16D1ED200D4DE1EB645DF24448FC4A8F77C6D82D706AC",
  confirmed_frontier: "6DA647EA687DC1F5E9C16D1ED200D4DE1EB645DF24448FC4A8F77C6D82D706AC",
  open_block: "12A2752307F0F6ED05D1819A230FD3ABDCF379F9FADC04F0FD182A6C177058F8",
  representative_block: "6DA647EA687DC1F5E9C16D1ED200D4DE1EB645DF24448FC4A8F77C6D82D706AC",
  balance: "126988409999999999999876600000",
  confirmed_balance: "126988409999999999999876600000",
  modified_timestamp: "1787323471",
  block_count: "873",
  account_version: "2",
  confirmation_height: "873",
  confirmation_height_frontier: "6DA647EA687DC1F5E9C16D1ED200D4DE1EB645DF24448FC4A8F77C6D82D706AC",
  representative: "nano_3chartsi6ja8ay1qq9xg3xegqnbg1qx76nouw6jedyb8wx3r4wu94rxap7hg",
};

export const MOCK_GET_ACCOUNT_INFO = vi.fn().mockResolvedValue(GET_ACCOUNT_INFO);

export const MOCK_GET_ACCOUNT_INFO_FRONTIER_CHANGED = vi.fn().mockResolvedValue({
  ...GET_ACCOUNT_INFO,
  frontier: "A2D7EFAFCB8738E462516B105AB86FF42B52C4851351354403C2289498C9619B",
});

export const MOCK_GET_ACCOUNT_INFO_SMALL_BALANCE = vi.fn().mockResolvedValue({
  ...GET_ACCOUNT_INFO,
  confirmed_balance: "10000",
});

// -----

export const MOCK_SIGNER = {
  account: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
  getAccountInfo: MOCK_GET_ACCOUNT_INFO,
  getBlockInfo: MOCK_BLOCK_INFO_BLOCK_NOT_FOUND,
  processBlock: vi.fn().mockResolvedValue({
    hash: MOCK_SETTLED_BLOCK_HASH,
  }),
  generateSendBlock: vi.fn().mockResolvedValue(MOCK_SEND_BLOCK),
  setCustomWorkGenerator: vi.fn().mockResolvedValue(""),
  onBeforeWorkGeneration: vi.fn().mockResolvedValue(undefined),
  onAfterWorkGeneration: vi.fn().mockResolvedValue(undefined),
  getConfig: vi.fn().mockResolvedValue(undefined),
};

export const MOCK_SIGNER_BLOCK_FRONTIER_CHANGED = {
  ...MOCK_SIGNER,
  getAccountInfo: MOCK_GET_ACCOUNT_INFO_FRONTIER_CHANGED,
};

export const MOCK_SIGNER_BLOCK_ALREADY_EXISTS = {
  ...MOCK_SIGNER,
  getBlockInfo: MOCK_BLOCK_INFO_BLOCK_ALREADY_EXISTS,
};

export const MOCK_SIGNER_SMALL_BALANCE = {
  ...MOCK_SIGNER,
  getAccountInfo: MOCK_GET_ACCOUNT_INFO_SMALL_BALANCE,
};

export const MOCK_SIGNER_WITH_BLOCK_INFO_FOR_SETTLEMENT_TEST = {
  ...MOCK_SIGNER,
  getBlockInfo: vi
    .fn()
    .mockResolvedValueOnce(MOCK_BLOCK_INFO_BLOCK_NOT_FOUND())
    .mockResolvedValueOnce(MOCK_BLOCK_INFO_BLOCK_NOT_FOUND()) // mock the wait for a transaction confirmation
    .mockResolvedValueOnce(MOCK_BLOCK_INFO_BLOCK_NOT_FOUND()) // mock the wait for a transaction confirmation
    .mockResolvedValueOnce(MOCK_BLOCK_INFO_BLOCK_NOT_FOUND()) // mock the wait for a transaction confirmation
    .mockResolvedValueOnce(MOCK_BLOCK_INFO_BLOCK_NOT_FOUND()) // mock the wait for a transaction confirmation
    .mockResolvedValue(MOCK_BLOCK_INFO_BLOCK_ALREADY_EXISTS()),
};

// -----

export const MOCK_PAYMENT_REQUIREMENT_A = {
  scheme: SCHEME,
  network: NETWORK as `${string}:${string}`,
  asset: CURRENCY_CODE_XNO,
  payTo: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
  /*   amount: {
    asset: CURRENCY_CODE_XNO, */
  amount: "100000000000000000000000000",
  // },
  maxTimeoutSeconds: 120,
  extra: {},
};

export const MOCK_PAYMENT_REQUIREMENT_B = {
  scheme: SCHEME,
  network: NETWORK as `${string}:${string}`,
  asset: CURRENCY_CODE_XNO,
  amount: {
    asset: CURRENCY_CODE_XNO,
    amount: "1000000000000000000000000000",
  },
  payTo: "nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es",
  maxTimeoutSeconds: 120,
  extra: {},
};

// -----

export const MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT = {
  x402Version: SUPPORTED_X402_VERSION,
  resource: MOCK_RESOURCE_A,
  accepts: [MOCK_PAYMENT_REQUIREMENT_A, MOCK_PAYMENT_REQUIREMENT_A],
};

// -----

export const MOCK_PAYMENT_REQUIRED_RESPONSE_SERVER = {
  x402Version: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.x402Version,
  error: undefined,
  resource: MOCK_RESOURCE_A,
  accepts: [MOCK_PAYMENT_REQUIREMENT_A],
};

// -----

export const MOCK_PAYMENT_PAYLOAD = {
  x402Version: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.x402Version,
  extensions: undefined,
  payload: {
    block: MOCK_SEND_BLOCK,
  },
  resource: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.resource,
  accepted: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.accepts[0],
};

// -----

export const MOCK_PAYMENT_PAYLOAD_INVALID = {
  ...MOCK_PAYMENT_PAYLOAD,
  payload: {
    block: {
      ...MOCK_PAYMENT_PAYLOAD.payload.block,
      account: "nano_1m1tnqhi8pnyqn46ubm8cxc4agxdtftjye6obxk4f3dd9uefge65psf53i95", // wrong sending account
    },
  },
};

// -----

export const MOCK_PAYMENT_PAYLOAD_INVALID_SIGNATURE = {
  ...MOCK_PAYMENT_PAYLOAD,
  payload: {
    block: {
      ...MOCK_PAYMENT_PAYLOAD.payload.block,
      signature:
        "AAAAAAAAAAEE17CC7CF854F2529D2998093F92591D8D9FC870B51EEF667F630F3EBE52E69330EA4E272E509061C3D8E6CDF059E092A0B11B4D672EAAAAAAAAAA", // invalid signature
    },
  },
};
