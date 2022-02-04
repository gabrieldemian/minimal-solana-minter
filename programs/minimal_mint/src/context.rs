use crate::state::*;

/* deserialized instruction data. these are the ctx structs of the instructions inside lib.rs */

use {
    anchor_lang::{prelude::*, solana_program::system_program},
    metaplex_token_metadata,
};

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        mut,
        has_one = wallet,
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    #[account(mut)]
    pub wallet: AccountInfo<'info>,

    #[account(mut)]
    pub metadata: AccountInfo<'info>,

    #[account(mut)]
    pub mint: AccountInfo<'info>,

    #[account(signer)]
    pub mint_authority: AccountInfo<'info>,

    #[account(address = spl_token::id())]
    pub token_program: AccountInfo<'info>,

    #[account(address = metaplex_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,

    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(bump: u8, data: CandyMachineData)]
pub struct InitializeCandyMachine<'info> {

    #[account(
        init,
        seeds=[PREFIX.as_bytes(), SUFIX.as_bytes()],
        /* anchor automatically pays the rent if I use 'payer' and 'space' in this macro */
        payer = authority,
        bump = bump,
        space =
            8  +  // < discriminator
                  // \/ candy_machine
            8  + 8 + 8 + (38 * 1 /* multiply by n of creators */) + 4 + 2 + 8 +
            32 +  // < wallet
            32 +  // < authority
            32    // start date
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    #[account(constraint = wallet.data_is_empty() && wallet.lamports() > 0 )]
    pub wallet: AccountInfo<'info>,

    #[account(mut, signer, constraint= authority.data_is_empty() && authority.lamports() > 0)]
    pub authority: AccountInfo<'info>,

    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct UpdateCandyMachine<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    #[account(signer)]
    authority: AccountInfo<'info>,
}

/* RENT TABLE */
/* use this to calculate the space necessary of your accounts */

/*
    bool	        1 byte	    1 bit rounded up to 1 byte.
    u8 or i8	    1 byte	
    u16 or i16	    2 bytes	
    u32 or i32	    4 bytes	
    u64 or i64	    8 bytes	
    u128 or i128	16 bytes	
    [u16; 32]	    64 bytes	32 items x 2 bytes. [itemSize; arrayLength]
    PubKey	        32 bytes	Same as [u8; 32]
    vec<u16>	    Any multiple of 2 bytes + 4 bytes for the prefix	Need to allocate the maximum amount of item that could be required.
    String	        Any multiple of 1 byte + 4 bytes for the prefix	Same as vec<u8>
*/