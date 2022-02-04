import { web3 } from '@project-serum/anchor'
import {
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
} from './constants'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import fs from 'fs'

export const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: web3.PublicKey,
  payer: web3.PublicKey,
  walletAddress: web3.PublicKey,
  splTokenMintAddress: web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ]
  return new web3.TransactionInstruction({
    keys,
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
  })
}

export const getMetadata = async (
  mint: web3.PublicKey
): Promise<web3.PublicKey> => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0]
}

export const getTokenWallet = async (
  wallet: web3.PublicKey,
  mint: web3.PublicKey
) => {
  return (
    await web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0]
}

export function parsePrice(price: number, mantissa: number = LAMPORTS_PER_SOL) {
  return Math.ceil(price * mantissa)
}

/* your personal wallet. the program will mint NFTs to this address */
export const MY_WALLET = web3.Keypair.fromSecretKey(
  new Uint8Array(
    JSON.parse(fs.readFileSync(__dirname + '/devnet.json').toString())
  )
)
