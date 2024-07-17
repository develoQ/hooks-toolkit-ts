const ASSERT = (x, code) => {
  if (!x) {
    trace('error', 0, false)
    rollback(x.toString(), code)
  }
}

const ASSERT_KL_EQ = (m, n) => {
  ASSERT(n[0] === m[0] && n[1] === m[1] && n[2] === m[2] && n[3] === m[3], 0)
}

//C5D0F34B0A1905BC3B29AA1BE139FE04D60C8694D3950A8D80251D10B563A822
const ns = [
  0xc5, 0xd0, 0xf3, 0x4b, 0x0a, 0x19, 0x05, 0xbc, 0x3b, 0x29, 0xaa, 0x1b, 0xe1,
  0x39, 0xfe, 0x04, 0xd6, 0x0c, 0x86, 0x94, 0xd3, 0x95, 0x0a, 0x8d, 0x80, 0x25,
  0x1d, 0x10, 0xb5, 0x63, 0xa8, 0x22,
]

// 2D0CB3CD60DA33B5AA7FEA321F111663EAED32481C6B700E484550F45AD96223
const klkey = [
  0x00, 0x00, 0x2d, 0x0c, 0xb3, 0xcd, 0x60, 0xda, 0x33, 0xb5, 0xaa, 0x7f, 0xea,
  0x32, 0x1f, 0x11, 0x16, 0x63, 0xea, 0xed, 0x32, 0x48, 0x1c, 0x6b, 0x70, 0x0e,
  0x48, 0x45, 0x50, 0xf4, 0x5a, 0xd9, 0x62, 0x23,
]

const key = [
  0x2d, 0x0c, 0xb3, 0xcd, 0x60, 0xda, 0x33, 0xb5, 0xaa, 0x7f, 0xea, 0x32, 0x1f,
  0x11, 0x16, 0x63, 0xea, 0xed, 0x32, 0x48, 0x1c, 0x6b, 0x70, 0x0e, 0x48, 0x45,
  0x50, 0xf4, 0x5a, 0xd9, 0x62, 0x23,
]

const cur = [
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x55,
  0x53, 0x44, 0x00, 0x00, 0x00, 0x00, 0x00,
]

//rB6v18pQ765Z9DH5RQsTFevoQPFmRtBqhT
const a = [
  0x75, 0x6e, 0xde, 0x88, 0xa9, 0x07, 0xd4, 0xcc, 0xf3, 0x8d, 0x6a, 0xdb, 0x9f,
  0xc7, 0x94, 0x64, 0x19, 0xf0, 0xc4, 0x1d,
]
//raKM1bZkGmASBqN5v2swrf2uAPJ32Cd8GV
const b = [
  0x3a, 0x51, 0x8a, 0x22, 0x53, 0x81, 0x60, 0x84, 0x1c, 0x14, 0x32, 0xfe, 0x6f,
  0x3e, 0x6d, 0x6e, 0x76, 0x29, 0xfb, 0xba,
]

const KEYLET_HOOK = 1
const KEYLET_HOOK_STATE = 2
const KEYLET_ACCOUNT = 3
const KEYLET_AMENDMENTS = 4
const KEYLET_CHILD = 5
const KEYLET_SKIP = 6
const KEYLET_FEES = 7
const KEYLET_NEGATIVE_UNL = 8
const KEYLET_LINE = 9
const KEYLET_OFFER = 10
const KEYLET_QUALITY = 11
const KEYLET_EMITTED_DIR = 12
const KEYLET_TICKET = 13
const KEYLET_SIGNERS = 14
const KEYLET_CHECK = 15
const KEYLET_DEPOSIT_PREAUTH = 16
const KEYLET_UNCHECKED = 17
const KEYLET_OWNER_DIR = 18
const KEYLET_PAGE = 19
const KEYLET_ESCROW = 20
const KEYLET_PAYCHAN = 21
const KEYLET_EMITTED = 22
const KEYLET_NFT_OFFER = 23
const KEYLET_HOOK_DEFINITION = 24
const KEYLET_HOOK_STATE_DIR = 25
const KEYLET_URITOKEN = 26

const INVALID_ARGUMENT = -7

const Hook = (arg) => {
  // Test one of each type
  let e, ans

  // KEYLET_HOOK
  e = util_keylet(KEYLET_HOOK, a)
  ASSERT(34 === e.length, 1)
  ans = [
    0x00, 0x48, 0x6c, 0x4b, 0x29, 0xc6, 0x0f, 0x40, 0x5d, 0xb7, 0x6e, 0x87,
    0x65, 0x4a, 0x2f, 0x15, 0x4b, 0xab, 0x99, 0xc7, 0x62, 0x29, 0x80, 0x10,
    0xa1, 0x89, 0x78, 0x52, 0x90, 0x80, 0x2f, 0x78, 0xbd, 0xcc,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_HOOK_STATE
  e = util_keylet(KEYLET_HOOK_STATE, b, key, ns)
  ASSERT(34 === e.length, 2)
  ans = [
    0x00, 0x76, 0x28, 0xaf, 0xcc, 0x25, 0x0a, 0x64, 0x41, 0x8e, 0xb7, 0x83,
    0x68, 0xeb, 0x4e, 0xc5, 0x52, 0x4a, 0xeb, 0x97, 0x54, 0xab, 0xc1, 0x0b,
    0x13, 0x06, 0x7f, 0xfb, 0x9f, 0x4b, 0xd8, 0x38, 0x62, 0xf2,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_ACCOUNT
  e = util_keylet(KEYLET_ACCOUNT, b)
  ASSERT(34 === e.length, 3)
  ans = [
    0x00, 0x61, 0xc6, 0x55, 0xdd, 0x8d, 0x8e, 0xd3, 0xba, 0xb4, 0xa0, 0xf1,
    0xec, 0x2d, 0xa9, 0x99, 0xf4, 0x1b, 0xa6, 0x82, 0xc6, 0x84, 0xf9, 0x99,
    0x66, 0xb9, 0x3c, 0x9a, 0xc3, 0xe3, 0x5c, 0x9a, 0x81, 0x6d,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_AMENDMENTS
  e = util_keylet(KEYLET_AMENDMENTS)
  ASSERT(34 === e.length, 4)
  ans = [
    0x00, 0x66, 0x7d, 0xb0, 0x78, 0x8c, 0x02, 0x0f, 0x02, 0x78, 0x0a, 0x67,
    0x3d, 0xc7, 0x47, 0x57, 0xf2, 0x38, 0x23, 0xfa, 0x30, 0x14, 0xc1, 0x86,
    0x6e, 0x72, 0xcc, 0x4c, 0xd8, 0xb2, 0x26, 0xcd, 0x6e, 0xf4,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_CHILD
  e = util_keylet(KEYLET_CHILD, key)
  ASSERT(34 === e.length, 5)
  ans = [
    0x1c, 0xd2, 0x2d, 0x0c, 0xb3, 0xcd, 0x60, 0xda, 0x33, 0xb5, 0xaa, 0x7f,
    0xea, 0x32, 0x1f, 0x11, 0x16, 0x63, 0xea, 0xed, 0x32, 0x48, 0x1c, 0x6b,
    0x70, 0x0e, 0x48, 0x45, 0x50, 0xf4, 0x5a, 0xd9, 0x62, 0x23,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_SKIP
  e = util_keylet(KEYLET_SKIP)
  ASSERT(34 === e.length, 6)
  ans = [
    0x00, 0x68, 0xb4, 0x97, 0x9a, 0x36, 0xcd, 0xc7, 0xf3, 0xd3, 0xd5, 0xc3,
    0x1a, 0x4e, 0xae, 0x2a, 0xc7, 0xd7, 0x20, 0x9d, 0xda, 0x87, 0x75, 0x88,
    0xb9, 0xaf, 0xc6, 0x67, 0x99, 0x69, 0x2a, 0xb0, 0xd6, 0x6b,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_FEES
  e = util_keylet(KEYLET_FEES)
  ASSERT(34 === e.length, 7)
  ans = [
    0x00, 0x73, 0x4b, 0xc5, 0x0c, 0x9b, 0x0d, 0x85, 0x15, 0xd3, 0xea, 0xae,
    0x1e, 0x74, 0xb2, 0x9a, 0x95, 0x80, 0x43, 0x46, 0xc4, 0x91, 0xee, 0x1a,
    0x95, 0xbf, 0x25, 0xe4, 0xaa, 0xb8, 0x54, 0xa6, 0xa6, 0x51,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_NEGATIVE_UNL
  e = util_keylet(KEYLET_NEGATIVE_UNL)
  ASSERT(34 === e.length, 8)
  ans = [
    0x00, 0x4e, 0x2e, 0x8a, 0x59, 0xaa, 0x9d, 0x3b, 0x5b, 0x18, 0x6b, 0x0b,
    0x9e, 0x0f, 0x62, 0xe6, 0xc0, 0x25, 0x87, 0xca, 0x74, 0xa4, 0xd7, 0x78,
    0x93, 0x8e, 0x95, 0x7b, 0x63, 0x57, 0xd3, 0x64, 0xb2, 0x44,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_LINE
  e = util_keylet(KEYLET_LINE, a, b, cur)
  ASSERT(34 === e.length, 9)
  ans = [
    0x00, 0x72, 0x0e, 0xb8, 0x2a, 0xdd, 0x5e, 0x15, 0x59, 0x1b, 0xf6, 0xe3,
    0x6d, 0xbc, 0x3c, 0x12, 0xd3, 0x07, 0x6d, 0x43, 0xa8, 0x53, 0xf8, 0xf9,
    0xe8, 0xa7, 0xd8, 0x4f, 0xe1, 0xe9, 0x7a, 0x2a, 0xc7, 0x3d,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_OFFER
  e = util_keylet(KEYLET_OFFER, a, 1)
  ASSERT(34 === e.length, 10)
  ans = [
    0x00, 0x6f, 0x60, 0x14, 0x48, 0x80, 0x97, 0x5f, 0x76, 0x6a, 0xb2, 0x2c,
    0x32, 0x2f, 0x10, 0x8e, 0x03, 0x43, 0x51, 0xde, 0x89, 0x6c, 0xf4, 0x9f,
    0x6b, 0x4a, 0xc7, 0x2c, 0x54, 0xf7, 0x27, 0x29, 0x9b, 0xe8,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_OFFER
  e = util_keylet(KEYLET_OFFER, a, ns)
  ASSERT(34 === e.length, 11)
  ans = [
    0x00, 0x6f, 0x23, 0x61, 0x7f, 0x44, 0x91, 0x1c, 0xba, 0x3b, 0x5c, 0xbe,
    0xe9, 0x42, 0x22, 0xac, 0xa4, 0x29, 0xf4, 0xd6, 0x60, 0x01, 0xa8, 0xab,
    0x9b, 0x98, 0x5e, 0xb8, 0xb8, 0x42, 0x9f, 0x1e, 0x91, 0x4b,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_QUALITY
  klkey[0] = 0
  klkey[1] = 0x65
  e = util_keylet(KEYLET_QUALITY, klkey, 0, 1)
  ASSERT(INVALID_ARGUMENT === e, 12)
  // ans = [
  //   0x00, 0x6f, 0x23, 0x61, 0x7f, 0x44, 0x91, 0x1c, 0xba, 0x3b, 0x5c, 0xbe,
  //   0xe9, 0x42, 0x22, 0xac, 0xa4, 0x29, 0xf4, 0xd6, 0x60, 0x01, 0xa8, 0xab,
  //   0x9b, 0x98, 0x5e, 0xb8, 0xb8, 0x42, 0x9f, 0x1e, 0x91, 0x4b,
  // ]
  // ASSERT_KL_EQ(e, ans)

  // KEYLET_QUALITY
  klkey[1] = 0x64
  e = util_keylet(KEYLET_QUALITY, klkey, 0, 1)
  ASSERT(34 === e.length, 13)
  ans = [
    0x00, 0x64, 0x2d, 0x0c, 0xb3, 0xcd, 0x60, 0xda, 0x33, 0xb5, 0xaa, 0x7f,
    0xea, 0x32, 0x1f, 0x11, 0x16, 0x63, 0xea, 0xed, 0x32, 0x48, 0x1c, 0x6b,
    0x70, 0x0e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_EMITTED_DIR
  e = util_keylet(KEYLET_EMITTED_DIR)
  ASSERT(34 === e.length, 14)
  ans = [
    0x00, 0x64, 0xb4, 0xde, 0x82, 0x30, 0x55, 0xd0, 0x0b, 0xc1, 0x2c, 0xd7,
    0x8f, 0xe1, 0xaa, 0xf7, 0x4e, 0xe6, 0x06, 0x21, 0x95, 0xb2, 0x62, 0x9f,
    0x49, 0xa2, 0x59, 0x15, 0xa3, 0x9c, 0x64, 0xbe, 0x19, 0x00,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_SIGNERS
  e = util_keylet(KEYLET_SIGNERS, a)
  ASSERT(34 === e.length, 15)
  ans = [
    0x00, 0x53, 0xdf, 0x8f, 0xf0, 0xce, 0x41, 0x1a, 0x3b, 0x8f, 0x1b, 0xb5,
    0xbb, 0x32, 0x78, 0x17, 0x15, 0xd6, 0x77, 0x42, 0xf5, 0xb5, 0x63, 0xb8,
    0x77, 0xb3, 0x3b, 0x07, 0x76, 0xf6, 0xf7, 0xbc, 0xda, 0x1d,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_CHECK
  e = util_keylet(KEYLET_CHECK, a, 1)
  ASSERT(34 === e.length, 16)
  ans = [
    0x00, 0x43, 0x08, 0x1f, 0x26, 0xff, 0x79, 0x1a, 0xf7, 0x54, 0x26, 0xed,
    0xf9, 0xeb, 0x08, 0x44, 0x85, 0x28, 0x58, 0x2c, 0xb1, 0xa4, 0xef, 0x4f,
    0xd0, 0xb4, 0x49, 0x9b, 0x76, 0x82, 0xe7, 0x69, 0xa6, 0xb5,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_CHECK
  e = util_keylet(KEYLET_CHECK, a, ns)
  ASSERT(34 === e.length, 17)
  ans = [
    0x00, 0x43, 0x94, 0xe3, 0x6f, 0x0d, 0xd3, 0xed, 0xc0, 0x2c, 0x49, 0xa5,
    0xaa, 0x0e, 0xcc, 0x49, 0x18, 0x39, 0x92, 0xab, 0x57, 0xc3, 0x2d, 0x9e,
    0x45, 0x51, 0x04, 0x78, 0x49, 0x49, 0xd1, 0xe6, 0xd2, 0x01,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_DEPOSIT_PREAUTH
  e = util_keylet(KEYLET_DEPOSIT_PREAUTH, a, b)
  ASSERT(34 === e.length, 18)
  ans = [
    0x00, 0x70, 0x88, 0x90, 0x0f, 0x27, 0x66, 0x57, 0xbc, 0xc0, 0x5d, 0xa1,
    0x67, 0x40, 0xab, 0x9d, 0x33, 0x01, 0x8e, 0x45, 0x71, 0x7b, 0x0e, 0xc4,
    0x2e, 0x4d, 0x11, 0xbd, 0x6d, 0xbd, 0x94, 0x03, 0x48, 0xe0,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_UNCHECKED
  klkey[0] = 0
  klkey[1] = 0
  e = util_keylet(KEYLET_UNCHECKED, key)
  ASSERT(34 === e.length, 19)
  ans = klkey
  ASSERT_KL_EQ(e, ans)

  // KEYLET_OWNER_DIR
  e = util_keylet(KEYLET_OWNER_DIR, a)
  ASSERT(34 === e.length, 20)
  ans = [
    0x00, 0x64, 0xc8, 0x5e, 0x01, 0x29, 0x06, 0x7b, 0x75, 0xad, 0x30, 0xb0,
    0xaa, 0x1c, 0xc2, 0x5b, 0x0a, 0x82, 0xc7, 0xf9, 0xaa, 0xbd, 0xee, 0x05,
    0xff, 0x01, 0x66, 0x69, 0xef, 0x9d, 0x82, 0xdc, 0xec, 0x30,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_PAGE
  e = util_keylet(KEYLET_PAGE, ns, 0, 1)
  ASSERT(34 === e.length, 21)
  ans = [
    0x00, 0x64, 0x61, 0xe6, 0x05, 0x1a, 0xb0, 0x49, 0x89, 0x2e, 0x75, 0xc9,
    0x3d, 0x67, 0xfb, 0x7a, 0x63, 0xf1, 0xef, 0x56, 0xdd, 0xaf, 0x3e, 0x6b,
    0x43, 0x6f, 0x57, 0x6e, 0x8c, 0x01, 0x81, 0x98, 0x2e, 0x48,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_ESCROW
  e = util_keylet(KEYLET_ESCROW, a, 1)
  ASSERT(34 === e.length, 22)
  ans = [
    0x00, 0x75, 0x13, 0xef, 0x04, 0xcd, 0x33, 0x6a, 0xad, 0xf6, 0x3d, 0x0c,
    0x7e, 0x05, 0x6c, 0x84, 0x9a, 0x7c, 0xf6, 0x72, 0x5e, 0x99, 0xbc, 0x93,
    0x80, 0x1e, 0xf5, 0x78, 0xa0, 0x32, 0x72, 0x5b, 0x84, 0xfe,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_ESCROW
  e = util_keylet(KEYLET_ESCROW, a, ns)
  ASSERT(34 === e.length, 23)
  ans = [
    0x00, 0x75, 0xc1, 0xc6, 0xc5, 0x23, 0x74, 0x87, 0x12, 0x56, 0xaa, 0x7a,
    0x1f, 0xb3, 0x29, 0x7a, 0x0a, 0x55, 0x88, 0x7d, 0x16, 0x6a, 0xcf, 0x85,
    0x28, 0x59, 0x88, 0xc2, 0xda, 0x81, 0x7f, 0x03, 0x90, 0x43,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_PAYCHAN
  e = util_keylet(KEYLET_PAYCHAN, a, b, 1)
  ASSERT(34 === e.length, 24)
  ans = [
    0x00, 0x78, 0xed, 0x04, 0xce, 0x27, 0x20, 0x21, 0x55, 0x2b, 0xbf, 0xa1,
    0xe5, 0xff, 0xbb, 0x53, 0xb6, 0x45, 0xa2, 0xff, 0x8a, 0x44, 0x66, 0xd5,
    0x76, 0x24, 0xb5, 0x71, 0xe6, 0x44, 0x9e, 0xeb, 0xfc, 0x5a,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_PAYCHAN
  e = util_keylet(KEYLET_PAYCHAN, a, b, ns)
  ASSERT(34 === e.length, 25)
  ans = [
    0x00, 0x78, 0x7d, 0xe1, 0x01, 0xf6, 0x2b, 0xb0, 0x55, 0x80, 0xb9, 0xd6,
    0xb0, 0x3f, 0x3b, 0xb0, 0x01, 0xbd, 0xe6, 0x9b, 0x89, 0x0f, 0x8a, 0xcd,
    0xbe, 0x71, 0x73, 0x5e, 0xc3, 0x63, 0xf8, 0xc5, 0x4b, 0x9b,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_EMITTED
  e = util_keylet(KEYLET_EMITTED, ns)
  ASSERT(34 === e.length, 26)
  ans = [
    0x00, 0x45, 0xf3, 0x51, 0x2d, 0x1c, 0x80, 0xa3, 0xc0, 0xb1, 0x46, 0x04,
    0xe1, 0xad, 0xdb, 0x90, 0x1c, 0x66, 0x32, 0x10, 0x08, 0xcc, 0xd0, 0xab,
    0xd2, 0xdb, 0xbe, 0xc4, 0x08, 0xa6, 0x0f, 0x6a, 0x62, 0xe9,
  ]
  ASSERT_KL_EQ(e, ans)

  // KEYLET_NFT_OFFER
  e = util_keylet(KEYLET_NFT_OFFER, a, 1)
  ASSERT(34 === e.length, 27)

  // KEYLET_NFT_OFFER
  e = util_keylet(KEYLET_NFT_OFFER, a, ns)
  ASSERT(34 === e.length, 28)

  accept('', 0)
}
