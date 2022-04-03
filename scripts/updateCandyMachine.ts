
import { Program, BN, Idl } from '@project-serum/anchor'
import idl from '../target/idl/minimal_mint.json'
import { DEVNET_WALLET, parsePrice } from '../utils'
import { candyMachine, programId } from '../constants'
import { MinimalMint } from '../target/types/minimal_mint'

const main = async () => {

  const program = new Program(idl as Idl, programId) as Program<MinimalMint>

  await program.rpc.updateCandyMachine(
    new BN(parsePrice(0.7)),
    new BN(1640889000),
    {
      accounts: {
        candyMachine,
        authority: DEVNET_WALLET.publicKey,
      },
    }
  )

}

export default main
