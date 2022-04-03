import {
  Program,
  workspace,
  Provider,
  setProvider,
} from "@project-serum/anchor";
import { MinimalMint } from "../target/types/minimal_mint";
import { MintLayout, TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import { Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_METADATA_PROGRAM_ID, candyMachine } from "../constants";
import {
  createAssociatedTokenAccountInstruction,
  getMetadata,
  getTokenWallet,
  DEVNET_WALLET,
} from "../utils";
import initializeCandyMachine from "../scripts/initializeCandyMachine";

describe("tests", () => {
  setProvider(Provider.env());

  const program = workspace.MinimalMint as Program<MinimalMint>;

  it("can initialize candy machine", async () => {
    initializeCandyMachine();
  });

  /* make sure to replace the const 'candyMachine' */
  /* on /constants.ts with your own address, that you will get by running initializeCandyMachine() */

  // it("can mint an NFT", async () => {
  //
  //   try {
  //     /* this is just a configuration file with variables for each NFT */
  //     const candyMachineState = await program.account.candyMachine.fetch(
  //       candyMachine
  //     );
  //
  //     const mint = Keypair.generate();
  //     const token = await getTokenWallet(DEVNET_WALLET.publicKey, mint.publicKey);
  //     const metadata = await getMetadata(mint.publicKey);
  //
  //     const rent =
  //       await Provider.env().connection.getMinimumBalanceForRentExemption(
  //         MintLayout.span
  //       );
  //
  //     await program.rpc.mintNft(
  //       "Shrek #1",
  //       "https://api.amoebits.io/get/amoebits_1",
  //       {
  //         accounts: {
  //           candyMachine,
  //           authority: candyMachineState.authority,
  //           mint: mint.publicKey,
  //           metadata,
  //           mintAuthority: DEVNET_WALLET.publicKey,
  //           tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
  //           tokenProgram: TOKEN_PROGRAM_ID,
  //           systemProgram: SystemProgram.programId,
  //           rent: SYSVAR_RENT_PUBKEY,
  //         },
  //         signers: [mint],
  //         instructions: [
  //           /* create a token/mint account and pay the rent */
  //           SystemProgram.createAccount({
  //             fromPubkey: DEVNET_WALLET.publicKey,
  //             newAccountPubkey: mint.publicKey,
  //             space: MintLayout.span,
  //             lamports: rent,
  //             programId: TOKEN_PROGRAM_ID,
  //           }),
  //           Token.createInitMintInstruction(
  //             TOKEN_PROGRAM_ID,
  //             mint.publicKey,
  //             0, // decimals
  //             DEVNET_WALLET.publicKey, // mint authority
  //             DEVNET_WALLET.publicKey // freeze authority
  //           ),
  //           /* create an account that will hold your NFT */
  //           createAssociatedTokenAccountInstruction(
  //             token, // associated account
  //             DEVNET_WALLET.publicKey, // payer
  //             DEVNET_WALLET.publicKey, // wallet address (to)
  //             mint.publicKey // mint/token address
  //           ),
  //           /* mint a NFT to the mint account */
  //           Token.createMintToInstruction(
  //             TOKEN_PROGRAM_ID,
  //             mint.publicKey, // from
  //             token, // account that will receive the metadata
  //             DEVNET_WALLET.publicKey, // authority
  //             [],
  //             1 // amount
  //           ),
  //         ],
  //       }
  //     );
  //   } catch (e) {
  //     throw e;
  //   }
  // });



});
