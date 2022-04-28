import { PublicKey } from '@solana/web3.js'

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
)

/* metaplex program */
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

/* seed of the PDA, can be anything you want */
/* remember to change them on the contract too (state.rs file) */
export const PREFIX = 'dog'

/* replace the following with your own pubkeys */
export const candyMachine = new PublicKey(
  'EhKC7eUWhouKqwDK88wD3HHZ76C9YkqgZkB1KpUkBKNc'
)

export const programId = new PublicKey(
  '4DJz2TvohxXxovGgwjWZcfXoZaoHJR4cHvGTF15Bot42'
)
