## Minimalistic solana minter program

The objective of this repository is to be only a minimalistic template for NFTs projects on Solana, so you can build your own program with your own features using this as a model. Also, it is ideal for someone who wants to study Solana. And it uses Serum Anchor framework to make abstractions and to handle automatic serialization and deserialization.

It is inspired on Metaplex, however, it has a few advantages over Metaplex:

- Lower mint cost and lower deploy cost ~ 20% cheaper
- Way easier to study the code and to understand it
- Does not create a master edition by default on every mint
- Uses only 1 account for configuration, instead of 2
- Minimalistic

## My architecture with Serum Anchor framework

├─ src <br />
│ &emsp; ├─ context.rs -> structs used on instructions arguments  <br />
│ &emsp; ├─ error.rs -> error structs  <br />
│ &emsp; ├─ lib.rs -> my entrypoint, processor, and register modules  <br />
│ &emsp; ├─ state.rs -> state structs  <br />
│ &emsp; ├─ utils.rs -> helpers functions  <br />

## About the candy_machine

Metaplex uses 2 accounts for configuration, "config" and "candy_machine". I'm using only one (candy_machine) to reduce costs, confusion and make things simpler.

The "candy_machine" is just a configuration account with variables that will be common to every mint.

## How to use
- Copy your devnet keypair into the root folder, and name it `devnet.json` (dont worry, this file is listed on .gitignore)
- Change the cluster and your wallet location in `Anchor.toml`
- Go to `tests/minimal_mint.ts` and make sure the file will run the `initializeCandyMachine()` function
- Run `yarn` `anchor build` `anchor deploy` and `anchor test`
- Get your program id and candy_machine pubkey and replace the old values in `lib.rs` `Anchor.toml` `constants.ts`

## Useful links for studying
The following links helped me to understand the theory of Solana blockchain. I recommend them all.

[Building a Solana decentralised twitter](https://lorisleiva.com/create-a-solana-dapp-from-scratch/what-are-we-building) <br />
[Solana Cookbook](https://solanacookbook.com/core-concepts/accounts.html#facts) <br />
[Understanding Program Derived Addresses](https://www.brianfriel.xyz/understanding-program-derived-addresses/) <br />
[SPL Associate Token Account & Merge](https://solongwallet.medium.com/spl-associate-token-account-merge-b134b8e01dc0) <br />
[How to Mint An NFT On Solana](https://www.quicknode.com/guides/web3-sdks/how-to-mint-an-nft-on-solana)
