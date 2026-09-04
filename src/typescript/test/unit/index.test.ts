import { describe, it, expect, vi } from 'vitest'
import { x402Client } from '@x402/core/client'
import { x402ResourceServer, HTTPFacilitatorClient } from '@x402/core/server'
import { x402Facilitator } from '@x402/core/facilitator'
import { ExactNanoScheme } from '../../index'
import { ExactNanoScheme as ClientExactNanoScheme } from '../../client'
import { ExactNanoScheme as ServerExactNanoScheme } from '../../server'
import { ExactNanoScheme as FacilitatorExactNanoScheme } from '../../facilitator'
import { CURRENCY_CODE_XNO } from '../../common'

const SUPPORTED_X402_VERSION = 2
const SCHEME = 'exact'
const NETWORK = 'nano:mainnet'
const ASSET = 'XNO'
const PAYMENT_ID = '0262ee8c-d848-438c-93df-52db6000e483'

let paymentRequirement

// -----

const ROUTE_URL_A = '/sample-route-a'
const ROUTE_URL_B = '/sample-route-b'
const SAMPLE_ROUTE_A_KEY = 'GET ' + ROUTE_URL_A
const SAMPLE_ROUTE_B_KEY = 'GET ' + ROUTE_URL_B
const SAMPLE_BASE_URL = 'https://premium-api.com'

const SAMPLE_ROUTES = {
  [SAMPLE_ROUTE_A_KEY]: {
    scheme: SCHEME,
    network: NETWORK,
    price: '6000000000000000000000000000',
    payTo: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
    description: 'Premium content at /sample-route-a',
    mimeType: 'application/json',
  },
  [SAMPLE_ROUTE_B_KEY]: {
    scheme: SCHEME,
    network: NETWORK,
    price: '0.001', //denoted in nano units (i.e. contains decimal place). This is equivalent to 1000000000000000000000000000 in raw units,
    payTo: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
    description: 'Premium content at /sample-route-b',
    mimeType: 'application/json',
  },
}

const SAMPLE_RESOURCE_A = {
  url: SAMPLE_BASE_URL + ROUTE_URL_A,
  description: SAMPLE_ROUTES[SAMPLE_ROUTE_A_KEY].description,
  mimeType: SAMPLE_ROUTES[SAMPLE_ROUTE_A_KEY].mimeType,
}

// -----

const MOCK_SEND_BLOCK = {
  type: 'state',
  account: 'nano_1dz4mfgu5a1iq1zmnfcui1kwuno3nw9togicmmszm4ci7w51nqjd3sbej48e',
  previous: '8AEF920ABA234F23259B018F4AF945E849477A8171C5116FAF45736817D838A4',
  representative: 'nano_3chartsi6ja8ay1qq9xg3xegqnbg1qx76nouw6jedyb8wx3r4wu94rxap7hg',
  balance: '91258410000000000000000000000',
  link: '3C64F70AA4866905632537314E3CE21B0210499DB17A4F335F9E3CE2C59D3BF8',
  link_as_account: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
  work: 'dfbc0fe36423277a',
  signature:
    'D7A2146B4EDB0AD3975337580919A9FBECC570A2E554556E9C84257C9D0E6F49D055300B0C747059C1B7BFB224B7635A24CB150FC16B975EF29873F776264906',
}

// -----

const MOCK_SETTLED_BLOCK_HASH = 'E2FB233EF4554077A7BF1AA85851D5BF0B36965D2B0FB504B2BC778AB89917D3'

// -----

const MOCK_HELPER = {
  getAccountInfo: vi.fn().mockResolvedValue({
    frontier: '8AEF920ABA234F23259B018F4AF945E849477A8171C5116FAF45736817D838A4',
    open_block: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
    representative_block: '991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948',
    balance: '235580100176034320859259343606608761791',
    modified_timestamp: '1501793775',
    block_count: '33',
    account_version: '1',
    confirmation_height: '28',
    confirmation_height_frontier:
      '34C70FCA0952E29ADC7BEE6F20381466AE42BD1CFBA4B7DFFE8BD69DF95449EB',
  }),
  processBlock: vi.fn().mockResolvedValue({
    hash: MOCK_SETTLED_BLOCK_HASH,
  }),
  generateSendBlock: vi.fn().mockResolvedValue(MOCK_SEND_BLOCK),

  setNanoRpcUrl: vi.fn().mockResolvedValue(''),
  setNanoWorkGenerationUrl: vi.fn().mockResolvedValue(''),
  setNanoAccountPrivateKey: vi.fn().mockResolvedValue(''),
  clearNanoAccountPrivateKey: vi.fn().mockResolvedValue(undefined),
  setCustomWorkGenerator: vi.fn().mockResolvedValue(''),
  onBeforeWorkGeneration: vi.fn().mockResolvedValue(undefined),
  onAfterWorkGeneration: vi.fn().mockResolvedValue(undefined),
  getConfig: vi.fn().mockResolvedValue(undefined),
}

// -----

const MOCK_PAYMENT_REQUIREMENT = {
  scheme: 'exact',
  network: 'nano:mainnet',
  amount: '6000000000000000000000000000',
  asset: 'XNO',
  payTo: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
  maxTimeoutSeconds: 300,
  extra: {},
}

// -----

const MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT = {
  x402Version: 2,
  resource: SAMPLE_RESOURCE_A,
  accepts: [
    {
      scheme: SCHEME,
      network: NETWORK as `${string}:${string}`,
      asset: ASSET,
      amount: '6000000000000000000000000000',
      payTo: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
      maxTimeoutSeconds: 300,
    },
    {
      scheme: SCHEME,
      network: NETWORK as `${string}:${string}`,
      asset: ASSET,
      amount: '1000000000000000000000000000',
      payTo: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
      maxTimeoutSeconds: 300,
    },
  ],
}

// -----

const MOCK_PAYMENT_REQUIRED_RESPONSE_SERVER = {
  x402Version: 2,
  error: undefined,
  resource: SAMPLE_RESOURCE_A,
  accepts: [
    {
      scheme: SCHEME,
      network: NETWORK,
      amount: '6000000000000000000000000000',
      asset: ASSET,
      payTo: 'nano_1h56yw7cb3mb1ojkcfsjbryg68r4436suedtbwsoz9jwwd4stgzr744ft7es',
      maxTimeoutSeconds: 300,
      extra: {},
    },
  ],
}

// -----

const MOCK_PAYMENT_PAYLOAD = Object.assign(
  {},
  {
    x402Version: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.x402Version,
    extensions: undefined,
    payload: {
      block: MOCK_SEND_BLOCK,
    },
    resource: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.resource,
    accepted: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.accepts[0],
  },
)

const MOCK_PAYMENT_PAYLOAD_WITH_PAYMENT_ID = Object.assign({}, MOCK_PAYMENT_PAYLOAD, {
  payload: {
    block: MOCK_SEND_BLOCK,
  },
  accepted: MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT.accepts[1],
})

// ---------------------------------------------------

describe('@x402nano/exact', () => {
  it('should export ExactNanoScheme', () => {
    expect(ExactNanoScheme).toBeDefined()
    expect(typeof ExactNanoScheme).toBe('function')
  })
})

// ---------------------------------------------------

describe('@x402nano/exact/client', () => {
  let scheme
  let client

  it('should export ExactNanoScheme', () => {
    scheme = new ClientExactNanoScheme(MOCK_HELPER)
    expect(scheme).toBeDefined()
  })

  it('should create Client instance', () => {
    client = new x402Client()
    expect(client).toBeDefined()
  })

  it(`should have the scheme "${SCHEME}" on network "${NETWORK}" registered to Client`, () => {
    client.register(NETWORK, scheme)
    expect(
      client.registeredClientSchemes?.get(SUPPORTED_X402_VERSION)?.get(NETWORK)?.get(SCHEME)
        ?.scheme,
    ).toBe(SCHEME)
  })

  it(`should allow "${ASSET}" payments under the spend controls`, () => {
    // @x402/core >= 2.22 only allows default assets (e.g. USD) unless opt-in
    // entries are listed in spendControls.allowedAssets — XNO is not a default.
    client.setSpendControls({
      allowedAssets: [{ network: NETWORK, asset: ASSET }],
    })
    expect(client).toBeDefined()
  })

  it('should have valid PaymentPayload', async () => {
    expect(await client.createPaymentPayload(MOCK_PAYMENT_REQUIRED_RESPONSE_CLIENT)).toStrictEqual(
      MOCK_PAYMENT_PAYLOAD,
    )
  })
})

// ---------------------------------------------------

describe('@x402nano/exact/server', () => {
  let scheme
  let server

  it('should export ExactNanoScheme', () => {
    scheme = new ServerExactNanoScheme()
    expect(scheme).toBeDefined()
  })

  it('should create Server instance', async () => {
    let facilitatorClient = new HTTPFacilitatorClient()

    facilitatorClient.getSupported = vi.fn().mockResolvedValue({
      kinds: [
        {
          x402Version: SUPPORTED_X402_VERSION,
          scheme: SCHEME,
          network: NETWORK,
        },
      ],
      extensions: [],
    })

    server = new x402ResourceServer(facilitatorClient)

    expect(server).toBeDefined()
  })

  it(`should have the scheme "${SCHEME}" on network "${NETWORK}" registered to Server`, async () => {
    server.register(NETWORK, scheme)
    await server.initialize()
    expect(server.registeredServerSchemes?.get(NETWORK)?.get(SCHEME)?.scheme).toBe(SCHEME)
  })

  it(`should have a valid Payment Required response`, async () => {
    paymentRequirement = (
      await server.buildPaymentRequirements(SAMPLE_ROUTES[SAMPLE_ROUTE_A_KEY])
    )[0]
    let paymentRequiredResponse = await server.createPaymentRequiredResponse(
      [paymentRequirement],
      SAMPLE_RESOURCE_A,
    )

    expect(paymentRequiredResponse).toStrictEqual(MOCK_PAYMENT_REQUIRED_RESPONSE_SERVER)
  })

  it(`should parse a price (raw units, string type)`, async () => {
    expect(await scheme.parsePrice('10000000000000000000000000', NETWORK)).toStrictEqual({
      amount: '10000000000000000000000000',
      asset: CURRENCY_CODE_XNO,
      extra: {},
    })
  })

  it(`should parse a price (raw units, number type)`, async () => {
    expect(await scheme.parsePrice(300000000000000000000000000, NETWORK)).toStrictEqual({
      amount: '300000000000000000000000000',
      asset: CURRENCY_CODE_XNO,
      extra: {},
    })
  })

  it(`should parse a price (nano units, string type)`, async () => {
    expect(await scheme.parsePrice(1.1, NETWORK)).toStrictEqual({
      amount: '1100000000000000000000000000000',
      asset: CURRENCY_CODE_XNO,
      extra: {},
    })
  })

  it(`should parse a price (nano units, number type)`, async () => {
    expect(await scheme.parsePrice('999999.999999', NETWORK)).toStrictEqual({
      amount: '999999999999000000000000000000000000',
      asset: CURRENCY_CODE_XNO,
      extra: {},
    })
  })
})

// ---------------------------------------------------

describe('@x402nano/exact/facilitator', () => {
  let scheme
  let facilitator

  it('should export ExactNanoScheme', () => {
    scheme = new FacilitatorExactNanoScheme(MOCK_HELPER)
    expect(scheme).toBeDefined()
  })

  it('should create Facilitator instance', () => {
    facilitator = new x402Facilitator()
    expect(facilitator).toBeDefined()
  })

  it(`should have the network "${NETWORK}" registered to Facilitator`, () => {
    facilitator.register(NETWORK, scheme)
    expect(
      facilitator.registeredFacilitatorSchemes
        ?.get(SUPPORTED_X402_VERSION)[0]
        .networks.has(NETWORK),
    ).toBeTruthy()
  })

  it(`should return a valid verification response`, async () => {
    expect(await facilitator.verify(MOCK_PAYMENT_PAYLOAD, MOCK_PAYMENT_REQUIREMENT)).toStrictEqual({
      isValid: true,
      invalidReason: undefined,
      payer: MOCK_SEND_BLOCK.account,
    })
  })

  it(`should return a valid settlement response`, async () => {
    expect(await facilitator.settle(MOCK_PAYMENT_PAYLOAD, MOCK_PAYMENT_REQUIREMENT)).toStrictEqual({
      success: true,
      transaction: MOCK_SETTLED_BLOCK_HASH,
      network: NETWORK,
      payer: MOCK_SEND_BLOCK.account,
    })
  })
})
