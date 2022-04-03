
import { Program, workspace, BN } from '@project-serum/anchor'
import { SystemProgram, PublicKey } from '@solana/web3.js'
import idl from '../target/idl/minimal_mint.json'
import { DEVNET_WALLET, parsePrice } from '../utils'
import { PREFIX } from '../constants'
import { MinimalMint } from '../target/types/minimal_mint'

const main = async () => {

  const program = workspace.MinimalMint as Program<MinimalMint>

  /* generating a PDA */
  const [candyMachine] = await PublicKey.findProgramAddress(
    [Buffer.from(PREFIX)],
    new PublicKey(idl.metadata.address)
  )

  await program.rpc.initializeCandyMachine(
    {
      price: new BN(parsePrice(0.5)),
      nftsMinted: new BN(0),
      goLiveDate: new BN(1640889000),
      creators: [{ address: DEVNET_WALLET.publicKey, verified: true, share: 100 }],
      symbol: 'SMM',
      sellerFeeBasisPoints: 500, // 500 = 5%
      maxSupply: new BN(48),
    },
    {
      accounts: {
        candyMachine,
        authority: DEVNET_WALLET.publicKey,
        systemProgram: SystemProgram.programId,
      },
    }
  )
}

export default main
