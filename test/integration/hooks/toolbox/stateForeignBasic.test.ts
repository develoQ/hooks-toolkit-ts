// xrpl
import {
  Invoke,
  LedgerEntryRequest,
  SetHookFlags,
  TransactionMetadata,
} from '@transia/xrpl'
import { Hook as LeHook } from '@transia/xrpl/dist/npm/models/ledger'
import { AccountID, UInt64 } from '@transia/ripple-binary-codec/dist/types'
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
  ExecutionUtility,
  createHookPayload,
  setHooksV3,
  clearAllHooksV3,
  iHookParamEntry,
  iHookParamName,
  iHookParamValue,
  hexNamespace,
  padHexString,
  iHookGrantEntry,
  iHookGrantHash,
  iHookGrantAuthorize,
  StateUtility,
  flipHex,
} from '../../../../dist/npm/src'

// StateForeignBasic: ROLLBACK: invalid account
// StateForeignBasic: ROLLBACK: no grant hash
// StateForeignBasic: ROLLBACK: no grant authorize
// StateForeignBasic: ACCEPT: success

/*

NATIVE HOOK: Hook Account that contains the foreign_state_set code
FOREIGN HOOK: Hook Account you configure the Grant/s on

> Foreign is a point of reference.

1. Install Native Hook -> HookHash
2. Use HookHash + Account to configure grant on Foreign Hook

*/

describe('stateForeignBasic', () => {
  let testContext: XrplIntegrationTestContext

  beforeAll(async () => {
    testContext = await setupClient(serverUrl)
  })
  afterAll(async () => {
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
    } as SetHookParams)
    await clearAllHooksV3({
      client: testContext.client,
      seed: testContext.hook2.seed,
    } as SetHookParams)
    await teardownClient(testContext)
  })

  it('state foreign basic - invalid account', async () => {
    const hook1Wallet = testContext.hook1
    const hook2Wallet = testContext.hook2
    const hook2AccHex = AccountID.from(hook2Wallet.classicAddress).toHex()

    // NATIVE HOOK
    const hook1 = createHookPayload({
      version: 0,
      createFile: 'state_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook1 }],
    } as SetHookParams)

    // FOREIGN HOOK
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('FA'),
      new iHookParamValue(hook2AccHex, true)
    )
    const hook2param2 = new iHookParamEntry(
      new iHookParamName('FK'),
      new iHookParamValue(hook2AccHex, true)
    )
    const hook2param3 = new iHookParamEntry(
      new iHookParamName('FN'),
      new iHookParamValue(hexNamespace('foreign'), true)
    )
    const hook2 = createHookPayload({
      version: 0,
      createFile: 'state_foreign_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookParams: [
        hook2param1.toXrpl(),
        hook2param2.toXrpl(),
        hook2param3.toXrpl(),
      ],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook2.seed,
      hooks: [{ Hook: hook2 }],
    } as SetHookParams)

    try {
      // INVOKE IN NATIVE
      const builtTx1: Invoke = {
        TransactionType: 'Invoke',
        Account: hook1Wallet.classicAddress,
      }
      await Xrpld.submit(testContext.client, {
        wallet: hook1Wallet,
        tx: builtTx1,
      })
    } catch (error: any) {
      expect(error.message).toEqual(
        'state_foreign_basic: Could not get foreign state'
      )
    }
  })

  it('state foreign basic - no grant', async () => {
    const hook1Wallet = testContext.hook1
    const hook2Wallet = testContext.hook2
    const hook1AccHex = AccountID.from(hook1Wallet.classicAddress).toHex()

    // NATIVE HOOK
    const hook1 = createHookPayload({
      version: 0,
      createFile: 'state_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.hook1.seed,
      hooks: [{ Hook: hook1 }],
    } as SetHookParams)

    // FOREIGN HOOK
    const hook2param1 = new iHookParamEntry(
      new iHookParamName('FA'),
      new iHookParamValue(hook1AccHex, true)
    )
    const hook2param2 = new iHookParamEntry(
      new iHookParamName('FK'),
      new iHookParamValue(hook1AccHex, true)
    )
    const hook2param3 = new iHookParamEntry(
      new iHookParamName('FN'),
      new iHookParamValue(hexNamespace('foreign'), true)
    )
    const hook2 = createHookPayload({
      version: 0,
      createFile: 'state_foreign_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookParams: [
        hook2param1.toXrpl(),
        hook2param2.toXrpl(),
        hook2param3.toXrpl(),
      ],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.bob.seed,
      hooks: [{ Hook: hook2 }],
    } as SetHookParams)

    // INVOKE IN NATIVE
    const builtTx1: Invoke = {
      TransactionType: 'Invoke',
      Account: hook1Wallet.classicAddress,
    }
    await Xrpld.submit(testContext.client, {
      wallet: hook1Wallet,
      tx: builtTx1,
    })

    try {
      // INVOKE IN FOREIGN
      const builtTx2: Invoke = {
        TransactionType: 'Invoke',
        Account: hook2Wallet.classicAddress,
      }
      await Xrpld.submit(testContext.client, {
        wallet: hook2Wallet,
        tx: builtTx2,
      })
    } catch (error: any) {
      expect(error.message).toEqual(
        'state_foreign_basic: Could not get foreign state'
      )
    }
  })

  it('state foreign basic - no grant authorize', async () => {
    const hook1Wallet = testContext.hook1
    const hook2Wallet = testContext.hook2
    const aliceWallet = testContext.alice
    const hook1AccHex = AccountID.from(hook1Wallet.classicAddress).toHex()

    // NATIVE HOOK
    const hook1param1 = new iHookParamEntry(
      new iHookParamName('FA'),
      new iHookParamValue(hook1AccHex, true)
    )
    const hook1param2 = new iHookParamEntry(
      new iHookParamName('FK'),
      new iHookParamValue(padHexString(hook1AccHex), true)
    )
    const hook1param3 = new iHookParamEntry(
      new iHookParamName('FN'),
      new iHookParamValue(hexNamespace('foreign'), true)
    )
    const hook1 = createHookPayload({
      version: 0,
      createFile: 'state_foreign_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookParams: [
        hook1param1.toXrpl(),
        hook1param2.toXrpl(),
        hook1param3.toXrpl(),
      ],
    })

    await setHooksV3({
      client: testContext.client,
      seed: testContext.bob.seed,
      hooks: [{ Hook: hook1 }],
    } as SetHookParams)

    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: testContext.bob.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    const hookHash = leHook.Hooks[0].Hook.HookHash

    // FOREIGN HOOK
    const hook2Grant1 = new iHookGrantEntry(
      new iHookGrantHash(hookHash as string),
      new iHookGrantAuthorize(aliceWallet.classicAddress)
    )
    const hook2 = createHookPayload({
      version: 0,
      createFile: 'state_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookGrants: [hook2Grant1.toXrpl()],
    })
    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook2 }],
    } as SetHookParams)

    // INVOKE IN FOREIGN
    const builtTx1: Invoke = {
      TransactionType: 'Invoke',
      Account: hook1Wallet.classicAddress,
    }
    await Xrpld.submit(testContext.client, {
      wallet: hook1Wallet,
      tx: builtTx1,
    })

    try {
      // INVOKE IN NATIVE
      const builtTx2: Invoke = {
        TransactionType: 'Invoke',
        Account: hook2Wallet.classicAddress,
      }
      await Xrpld.submit(testContext.client, {
        wallet: hook2Wallet,
        tx: builtTx2,
      })
    } catch (error: any) {
      expect(error.message).toEqual(
        'state_foreign_basic: Could not set foreign state'
      )
    }
  })

  it('state foreign basic - success', async () => {
    const hook1Wallet = testContext.alice
    const bobWallet = testContext.bob
    const hook1AccHex = AccountID.from(hook1Wallet.classicAddress).toHex()

    // NATIVE HOOK
    const hook1param1 = new iHookParamEntry(
      new iHookParamName('FA'),
      new iHookParamValue(hook1AccHex, true)
    )
    const hook1param2 = new iHookParamEntry(
      new iHookParamName('FK'),
      new iHookParamValue(padHexString(hook1AccHex), true)
    )
    const hook1param3 = new iHookParamEntry(
      new iHookParamName('FN'),
      new iHookParamValue(hexNamespace('foreign'), true)
    )
    const hook1 = createHookPayload({
      version: 0,
      createFile: 'state_foreign_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookParams: [
        hook1param1.toXrpl(),
        hook1param2.toXrpl(),
        hook1param3.toXrpl(),
      ],
    })

    await setHooksV3({
      client: testContext.client,
      seed: testContext.bob.seed,
      hooks: [{ Hook: hook1 }],
    } as SetHookParams)

    const hookReq: LedgerEntryRequest = {
      command: 'ledger_entry',
      hook: {
        account: testContext.bob.classicAddress,
      },
    }
    const hookRes = await testContext.client.request(hookReq)
    const leHook = hookRes.result.node as LeHook
    const hookHash = leHook.Hooks[0].Hook.HookHash

    // FOREIGN HOOK
    const hook2Grant1 = new iHookGrantEntry(
      new iHookGrantHash(hookHash as string),
      new iHookGrantAuthorize(bobWallet.classicAddress)
    )
    const hook2 = createHookPayload({
      version: 0,
      createFile: 'state_basic',
      namespace: 'foreign',
      flags: SetHookFlags.hsfOverride,
      hookOnArray: ['Invoke'],
      hookGrants: [hook2Grant1.toXrpl()],
    })

    await setHooksV3({
      client: testContext.client,
      seed: testContext.alice.seed,
      hooks: [{ Hook: hook2 }],
    } as SetHookParams)

    // INVOKE OUT FOREIGN
    const builtTx1: Invoke = {
      TransactionType: 'Invoke',
      Account: hook1Wallet.classicAddress,
    }
    const result = await Xrpld.submit(testContext.client, {
      wallet: hook1Wallet,
      tx: builtTx1,
    })

    const hookExecutions = await ExecutionUtility.getHookExecutionsFromMeta(
      testContext.client,
      result.meta as TransactionMetadata
    )
    console.log(hookExecutions.executions[0].HookReturnString)
    // expect(hookExecutions.executions[0].HookReturnString).toEqual('')

    const hook2State = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      padHexString(hook1AccHex),
      'foreign'
    )
    const foreignPreState = Number(
      UInt64.from(flipHex(hook2State.HookStateData)).valueOf()
    )

    // INVOKE OUT NATIVE
    const builtTx2: Invoke = {
      TransactionType: 'Invoke',
      Account: bobWallet.classicAddress,
    }
    await Xrpld.submit(testContext.client, {
      wallet: bobWallet,
      tx: builtTx2,
    })

    const hook1State = await StateUtility.getHookState(
      testContext.client,
      testContext.alice.classicAddress,
      padHexString(hook1AccHex),
      'foreign'
    )
    const nativePostState = Number(
      UInt64.from(flipHex(hook1State.HookStateData)).valueOf()
    )
    expect(nativePostState).toEqual(foreignPreState + 1)
  })
})
