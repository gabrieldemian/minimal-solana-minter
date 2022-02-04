use {
    crate::{error::ErrorCode, state::CandyMachineData},
    anchor_lang::prelude::*,
    context::*,
};
pub mod context;
pub mod error;
pub mod state;
pub mod utils;

declare_id!("4DJz2TvohxXxovGgwjWZcfXoZaoHJR4cHvGTF15Bot42");

#[program]
pub mod minimal_mint {

    use super::*;
    use anchor_lang::solana_program::{program::{invoke_signed, invoke}, system_instruction};
    use metaplex_token_metadata::{instruction::{create_metadata_accounts, update_metadata_accounts}, state::Creator};

    pub fn mint_nft(ctx: Context<MintNFT>, nft_name: String, nft_uri: String) -> ProgramResult {

        let candy_machine = &mut ctx.accounts.candy_machine;
        let now = Clock::get()?.unix_timestamp;

        if let Some(go_live_date) = candy_machine.data.go_live_date {
            /* only the authority can mint before the launch date */
            if now < go_live_date && *ctx.accounts.mint_authority.key != candy_machine.authority {
                return Err(ErrorCode::CandyMachineNotLiveYet.into());
            }
        }

        /* check if the payer (mint_authority) has enough SOL to pay the mint cost */
        if ctx.accounts.mint_authority.lamports() < candy_machine.data.price {
            return Err(ErrorCode::NotEnoughSOL.into());
        }

        /* check if the collection still has NFTs to mint */
        if let Some(max_supply) = candy_machine.data.max_supply {
            if candy_machine.data.nfts_minted >= max_supply {
                return Err(ErrorCode::CandyMachineEmpty.into());
            }
        }

        /* pay fees - transfer money from the buyer to the treasury account */
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.mint_authority.key,
                ctx.accounts.wallet.key,
                candy_machine.data.price,
            ),
            &[
                ctx.accounts.mint_authority.clone(),
                ctx.accounts.wallet.clone(),
                ctx.accounts.system_program.clone(),
            ],
        )?;

        /* increment the counter of total mints by 1 */
        candy_machine.data.nfts_minted += 1;

        /* if you are confused about PDAs and why it is needed */
        /* please read this article: https://paulx.dev/blog/2021/01/14/programming-on-solana-an-introduction/#program-derived-addresses-pdas-part-1 */
        let (_pda_pubkey, bump) =
            Pubkey::find_program_address(&[state::PREFIX.as_bytes(), state::SUFIX.as_bytes()], &self::id());

        let authority_seeds = [state::PREFIX.as_bytes(), state::SUFIX.as_bytes(), &[bump]];

        let mut creators: Vec<Creator> = vec![Creator {
            address: candy_machine.key(),
            verified: true,
            share: 0,
        }];

        /* add the creators that will receive royalties from secondary sales */
        for c in &candy_machine.data.creators {
            creators.push(Creator {
                address: c.address,
                verified: false,
                share: c.share,
            });
        }

        let metadata_infos = vec![
            ctx.accounts.metadata.clone(),
            ctx.accounts.mint.clone(),
            ctx.accounts.mint_authority.clone(),
            ctx.accounts.mint_authority.clone(),
            ctx.accounts.token_metadata_program.clone(),
            ctx.accounts.token_program.clone(),
            ctx.accounts.system_program.clone(),
            ctx.accounts.rent.to_account_info().clone(),
            candy_machine.to_account_info().clone(),
        ];

        /* set the metadata of the NFT */
        invoke_signed(
            &create_metadata_accounts(
                *ctx.accounts.token_metadata_program.key,
                *ctx.accounts.metadata.key,
                *ctx.accounts.mint.key,
                *ctx.accounts.mint_authority.key,
                *ctx.accounts.mint_authority.key,
                candy_machine.key(),
                nft_name,
                candy_machine.data.symbol.to_string(),
                nft_uri,
                Some(creators),
                candy_machine.data.seller_fee_basis_points, // royalties percentage in basis point 500 = 5%
                true,                                       // update auth is signer?
                false,                                      // is mutable?
            ),
            metadata_infos.as_slice(),
            &[&authority_seeds],
        )?;

        /* at this point the NFT is already minted with the metadata */
        /* this invoke will disable more mints to the account */
        invoke(
            &spl_token::instruction::set_authority(
                &ctx.accounts.token_program.key(),
                &ctx.accounts.mint.key(),
                None,
                spl_token::instruction::AuthorityType::MintTokens,
                &ctx.accounts.mint_authority.key(),
                &[&ctx.accounts.mint_authority.key()],
            )?,
            &[
                ctx.accounts.mint_authority.clone(),
                ctx.accounts.mint.clone(),
                ctx.accounts.token_program.clone(),
            ],
        )?;

        /* denote that the primary sale has happened */
        /* and disable future updates to the NFT, so it is truly immutable */
        invoke_signed(
            &update_metadata_accounts(
                *ctx.accounts.token_metadata_program.key,
                *ctx.accounts.metadata.key,
                candy_machine.key(),
                None,
                None,
                Some(true),
            ),
            &[
                ctx.accounts.token_metadata_program.clone(),
                ctx.accounts.metadata.clone(),
                candy_machine.to_account_info().clone(),
            ],
            &[&authority_seeds],
        )?;

        Ok(())
    }

    pub fn initialize_candy_machine(
        ctx: Context<InitializeCandyMachine>,
        _bump: u8,
        data: CandyMachineData,
    ) -> ProgramResult {
        
        let candy_machine = &mut ctx.accounts.candy_machine;

        msg!("pubkey {}", candy_machine.key());

        candy_machine.data = data;
        candy_machine.wallet = *ctx.accounts.wallet.key;
        candy_machine.authority = *ctx.accounts.authority.key;

        Ok(())
    }

    pub fn update_candy_machine(
        ctx: Context<UpdateCandyMachine>,
        price: Option<u64>,
        go_live_date: Option<i64>,
    ) -> ProgramResult {

        let candy_machine = &mut ctx.accounts.candy_machine;

        if let Some(p) = price {
            msg!("Price changed from {}", candy_machine.data.price);
            msg!("Price changed to {}", p);
            candy_machine.data.price = p;
        };

        if let Some(go_l) = go_live_date {
            msg!("Go live date from {:#?}", candy_machine.data.go_live_date);
            msg!("Go live date changed to {}", go_l);
            candy_machine.data.go_live_date = Some(go_l);
        };

        Ok(())
    }
}
