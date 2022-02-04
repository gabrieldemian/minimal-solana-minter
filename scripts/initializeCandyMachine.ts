
import { Program, web3, workspace, BN } from '@project-serum/anchor'
import idl from '../target/idl/minimal_mint.json'
import { MY_WALLET, parsePrice } from '../utils'
import { PREFIX, SUFIX } from '../constants'
import { MinimalMint } from '../target/types/minimal_mint'

const main = async () => {

  const { SystemProgram, PublicKey } = web3

  const program = workspace.MinimalMint as Program<MinimalMint>

  const [candyMachine, bump] = await PublicKey.findProgramAddress(
    [Buffer.from(PREFIX), Buffer.from(SUFIX)],
    new PublicKey(idl.metadata.address)
  )

  await program.rpc.initializeCandyMachine(
    bump,
    {
      price: new BN(parsePrice(0.5)),
      symbol: 'SMM',
      sellerFeeBasisPoints: 500, // 500 = 5%
      nftsMinted: new BN(0),
      goLiveDate: new BN(1640889000),
      maxSupply: new BN(48),
      creators: [{ address: MY_WALLET.publicKey, verified: true, share: 100 }],
    } as any,
    {
      accounts: {
        candyMachine,
        wallet: MY_WALLET.publicKey, // who will receive the SOL of each mint
        authority: MY_WALLET.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [MY_WALLET]
    }
  )
}

export default main
