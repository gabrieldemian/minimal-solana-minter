import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  Keypair,
  SystemProgram,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js'
import { candyMachine, TOKEN_METADATA_PROGRAM_ID } from '../constants'
import {
  createAssociatedTokenAccountInstruction,
  DEVNET_WALLET,
  getMetadata,
  getTokenWallet,
  program,
  provider
} from '../utils'

const mintNFT = async () => {
  /* make sure to replace the const 'candyMachine' */
  /* on /constants.ts with your own address,
  that you will get by running scripts/initializeCandyMachine.ts */
  const candyMachineState = await program.account.candyMachine.fetch(
    candyMachine
  )
  const mint = Keypair.generate()
  const token = await getTokenWallet(
    DEVNET_WALLET.publicKey,
    mint.publicKey
  )
  const metadata = await getMetadata(mint.publicKey)
  const rent = await provider.connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  )

  const accounts = {
    candyMachine,
    authority: candyMachineState.authority,
    mint: mint.publicKey,
    metadata,
    mintAuthority: DEVNET_WALLET.publicKey,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY
  }

  await program.methods
    .mintNft('Shrek #1', 'https://api.amoebits.io/get/amoebits_1')
    .accounts(accounts)
    .signers([mint])
    .preInstructions([
      /* create a token/mint account and pay the rent */
      SystemProgram.createAccount({
        fromPubkey: DEVNET_WALLET.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MintLayout.span,
        lamports: rent,
        programId: TOKEN_PROGRAM_ID
      }),
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey,
        0, // decimals
        DEVNET_WALLET.publicKey, // mint authority
        DEVNET_WALLET.publicKey // freeze authority
      ),
      /* create an account that will hold your NFT */
      createAssociatedTokenAccountInstruction(
        token, // associated account
        DEVNET_WALLET.publicKey, // payer
        DEVNET_WALLET.publicKey, // wallet address (to)
        mint.publicKey // mint/token address
      ),
      /* mint a NFT to the mint account */
      Token.createMintToInstruction(
        TOKEN_PROGRAM_ID,
        mint.publicKey, // from
        token, // account that will receive the metadata
        DEVNET_WALLET.publicKey, // authority
        [],
        1 // amount
      )
    ])
    .rpc()
}

export default mintNFT
