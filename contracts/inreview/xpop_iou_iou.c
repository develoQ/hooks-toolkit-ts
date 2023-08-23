#include <stdint.h>
#include "hookapi.h"

uint8_t txn[283] =
    {
        /* size,upto */
        /*   3,  0 */ 0x12U, 0x00U, 0x00U,                                    /* tt = Payment */
        /*   5,  3*/ 0x22U, 0x80U, 0x00U, 0x00U, 0x00U,                       /* flags = tfCanonical */
        /*   5,  8 */ 0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                      /* sequence = 0 */
        /*   5, 13 */ 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                      /* dtag, flipped */
        /*   6, 18 */ 0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,               /* first ledger seq */
        /*   6, 24 */ 0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,               /* last ledger seq */
        /*  49, 30 */ 0x61U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, /* amount field 9 or 49 bytes */
        0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
        0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
        0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
        0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
        0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99,
        /*   9, 79 */ 0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                                                   /* fee      */
        /*  35, 88 */ 0x73U, 0x21U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, /* pubkey   */
        /*  22,123 */ 0x81U, 0x14U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,                                        /* src acc  */
        /*  22,145 */ 0x83U, 0x14U, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,                                        /* dst acc  */
        /* 116,167 */                                                                                                                  /* emit details */
        /*   0,283 */
};

// ACCOUNTS
#define HOOK_ACC (txn + 125U)
#define OTXN_ACC (txn + 147U)

// TXS
#define FLS_OUT (txn + 20U)
#define LLS_OUT (txn + 26U)
#define DTAG_OUT (txn + 14U)
#define AMOUNT_OUT (txn + 30U)
#define EMIT_OUT (txn + 167U)
#define FEE_OUT (txn + 80U)

#define CUR_N_SIZE 3
uint8_t CUR_N[CUR_N_SIZE] =
    {
        0x43, 0x55, 0x52};

int64_t hook(uint32_t r)
{
    _g(1, 1);

    // ACCOUNT: Hook
    hook_account(HOOK_ACC, 20);

    // ACCOUNT: Origin
    otxn_field(OTXN_ACC, 20, sfAccount);

    // outgoing
    if (BUFFER_EQUAL_20(HOOK_ACC, OTXN_ACC))
        accept(SBUF("xpop_iou_iou.c: Passing outgoing txn."), __LINE__);

    // TT: Import
    if (otxn_type() != ttIMPORT)
        accept(SBUF("xpop_iou_iou.c: Passing non ttIMPORT txn."), otxn_type());

    // UTIL: XPOP
    int64_t retval = xpop_slot(1, 2);
    if (retval <= 0)
        NOPE("xpop_iou_iou.c: Failed to slot xpop");

#define tx_slot 1
#define meta_slot 2

    trace_num("Slotted xpop", 12, retval);
    uint8_t dump1[2048];
    uint8_t dump2[2048];
    int64_t len1 = slot(dump1, sizeof(dump1), tx_slot);
    int64_t len2 = slot(dump2, sizeof(dump2), meta_slot);

    trace("tx", 2, dump1, len1, 1);
    trace("meta", 4, dump2, len2, 1);

    if (slot_subfield(meta_slot, sfTransactionResult, 3) != 3)
        NOPE("xpop_iou_iou.c: Failed to slot transaction result");

    uint8_t tr;
    if (slot(SVAR(tr), 3) != 1)
        NOPE("xpop_iou_iou.c: Failed to dump transaction result");

    trace_num(SBUF("Inner Transaction Result:"), tr);
    if (tr != 0)
        NOPE("xpop_iou_iou.c: Inner Transaction Result not tesSUCCESS (0).");

    // execution to here means tesSUCCESS on inner

    if (slot_subfield(tx_slot, sfTransactionType, 4) != 4)
        NOPE("xpop_iou_iou.c: Could not slot transaction type");

    uint8_t tt_buf[2];
    if (slot(SBUF(tt_buf), 4) != 2)
        NOPE("xpop_iou_iou.c: Could not dump transaction type");

    uint16_t tt = UINT16_FROM_BUF(tt_buf);

    if (tt != ttPAYMENT)
        NOPE("xpop_iou_iou.c: Only NFTokenBurn is accepted");

        // go track down the URI of the token (this is a huge pain, has to be done through metadata)
        //
#define nodes 5
    if (slot_subfield(meta_slot, sfAffectedNodes, nodes) != nodes)
        NOPE("xpop_iou_iou.c: Could not slot sfAffectedNodes");

    uint8_t dump4[1024];
    trace(SBUF("slot nodes"), dump4, slot(SBUF(dump4), nodes), 1);

    int64_t count = slot_count(nodes);
    if (count > 5)
        count = 5;

    int64_t found = 0;

    for (int i = 0; GUARD(5), i < count; ++i)
    {
        if (slot_subarray(nodes, i, 6) != 6)
            continue;

        if (slot_subfield(6, sfLedgerEntryType, 8) != 8)
            NOPE("xpop_iou_iou.c: Could not slot LedgerEntryType");

        uint8_t buf[2];
        if (slot(SBUF(buf), 8) != 2)
            NOPE("xpop_iou_iou.c: Could not dump LedgerEntryType");

        TRACEHEX(buf);

        if (UINT16_FROM_BUF(buf) == 0x0072U)
        {
            found = 1;
            break;
        }
    }

    if (!found)
        NOPE("xpop_iou_iou.c: Could not find Payment in xpop metadata");


    // VALIDATION: PAYMENT XPOP
    if (slot_subfield(6, sfPreviousFields, 9) != 9 || slot_subfield(6, sfFinalFields, 10) != 10)
        NOPE("xpop_iou_iou.c: Could not slot sfPreviousFields or sfFinalFields");

    uint8_t prev_balance[48];
    uint8_t final_balance[48];
    if (slot_subfield(9, sfBalance, 11) != 11 || slot_subfield(10, sfBalance, 12) != 12)
        NOPE("xpop_iou_iou.c: Could not slot sfBalance");

    if (slot(SVAR(prev_balance), 11) != 48 || slot(SVAR(final_balance), 12) != 48)
        NOPE("xpop_iou_iou.c: Could not dump sfBalance");

    uint8_t high_limit[48];
    uint8_t low_limit[48];
    if (slot_subfield(10, sfHighLimit, 13) != 13 || slot_subfield(10, sfLowLimit, 14) != 14)
        NOPE("xpop_iou_iou.c: Could not slot sfHighLimit/sfLowLimit");

    if (slot(SVAR(high_limit), 13) != 48 || slot(SVAR(low_limit), 14) != 48)
        NOPE("xpop_iou_iou.c: Could not dump sfHighLimit/sfLowLimit");

    int is_high = BUFFER_EQUAL_20(HOOK_ACC, low_limit + 28);
    int is_low = BUFFER_EQUAL_20(OTXN_ACC, high_limit + 28);
    uint8_t limit_buf = is_high ? low_limit : high_limit;

    if (!is_high && !is_low)
    {
        NOPE("xpop_iou_iou.c: Issuer does not match hook account");
    }

    // KEYLET: TrustLine
    uint8_t bal_kl[34];
    if (util_keylet(SBUF(bal_kl), KEYLET_LINE, OTXN_ACC, SFS_ACCOUNT, limit_buf + 28, SFS_ACCOUNT, limit_buf + 8, 20) != 34)
    {
        NOPE("xpop_iou_iou.c: Missing trustline");
    }

    // TXN: PREPARE: Init
    etxn_reserve(1);

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t *)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4;
    *((uint32_t *)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: Amount
    int64_t amount_token = slot_float(13);
    float_sto(AMOUNT_OUT, 49, limit_buf + 8, 20, limit_buf + 28, 20, amount_token, sfAmount);

    // TXN PREPARE: Dest Tag <- Source Tag
    if (otxn_field(DTAG_OUT, 4, sfSourceTag) == 4)
        *(DTAG_OUT - 1) = 0x2EU;

    // TXN PREPARE: Emit Metadata
    etxn_details(EMIT_OUT, 116U);

    // TXN PREPARE: Fee
    {
        int64_t fee = etxn_fee_base(SBUF(txn));
        uint8_t *b = FEE_OUT;
        *b++ = 0b01000000 + ((fee >> 56) & 0b00111111);
        *b++ = (fee >> 48) & 0xFFU;
        *b++ = (fee >> 40) & 0xFFU;
        *b++ = (fee >> 32) & 0xFFU;
        *b++ = (fee >> 24) & 0xFFU;
        *b++ = (fee >> 16) & 0xFFU;
        *b++ = (fee >> 8) & 0xFFU;
        *b++ = (fee >> 0) & 0xFFU;
    }

    // TXN: Emit/Send Txn
    uint8_t emithash[32];
    int64_t emit_result = emit(SBUF(emithash), SBUF(txn));
    if (emit_result > 0)
    {
        return accept(SBUF("xpop_iou_iou.c: Finished"), __LINE__);
    }

    NOPE("xpop_iou_iou.c: Failed");
}