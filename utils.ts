import {
  AnchorProvider,
  Program,
  setProvider,
  workspace
} from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction
} from '@solana/web3.js'

import {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID
} from './constants'
import { MinimalMint } from './target/types/minimal_mint'

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: PublicKey,
  payer: PublicKey,
  walletAddress: PublicKey,
  splTokenMintAddress: PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    }
  ]
  return new TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([])
  })
}

export const getMetadata = async (mint: PublicKey): Promise<PublicKey> => {
  return (
    await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

export const getTokenWallet = async (
  wallet: PublicKey,
  mint: PublicKey
) => {
  return (
    await PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]
}

export function parsePrice(
  price: number,
  mantissa: number = LAMPORTS_PER_SOL
) {
  return Math.ceil(price * mantissa)
}

export const provider = AnchorProvider.env()
setProvider(provider)

export const DEVNET_WALLET = provider.wallet
export const program = workspace.MinimalMint as Program<MinimalMint>
