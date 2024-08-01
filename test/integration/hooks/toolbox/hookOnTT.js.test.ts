// xrpl
import { Invoke, Payment, SetHookFlags, xrpToDrops } from '@transia/xrpl'
// xrpl-helpers
import {
  XrplIntegrationTestContext,
  setupClient,
  teardownClient,
  serverUrl,
} from '../../../../src/libs/xrpl-helpers'
// src
import {
  Xrpld,
  SetHookParams,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
} from '../../../../dist/npm/src'

// HookOnTT: ACCEPT: success
// HookOnTT: ROLLBACK: invalid

describe('hookOnTT', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('invoke on tt - success', async () => {
    const hook = createHookPayload({
      version: 1,
      createFile: 'hookOnTT',
      namespace: 'hookOnTT',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      fee: '100000',
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)

    // INVOKE IN
    const hookWallet = testContext.hook1
    const bobWallet = testContext.bob
    const builtTx: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
      Destination: hookWallet.classicAddress,
    }
    await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx,
    })
  })

  it('invoke on tt - invalid', async () => {
    const hook = createHookPayload({
      version: 1,
      createFile: 'hookOnTT',
      namespace: 'hookOnTT',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke', 'Payment'],
      fee: '100000',
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook }],
    } as SetHookParams)
    try {
      // PAYMENT IN
      const hookWallet = testContext.hook1
      const bobWallet = testContext.bob
      const builtTx: Payment = {
        TransactionType: 'Payment',
        Account: bobWallet.classicAddress,
        Destination: hookWallet.classicAddress,
        Amount: xrpToDrops(1),
      }
      await Xrpld.submit(testContext.client, {
        wallet: bobWallet,
        tx: builtTx,
      })
      throw Error('invalid')
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual(
          'hookOnTT.ts: HookOn field is incorrectly set.'
        )
      }
    }
  })
})
