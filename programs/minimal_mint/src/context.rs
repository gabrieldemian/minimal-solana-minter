use crate::state::*;

use {
    anchor_lang::prelude::*,
    metaplex_token_metadata,
    anchor_spl::token::Token
};

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        mut,
        seeds = [PREFIX.as_bytes()],
        bump = candy_machine.bump
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    #[account(mut)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub authority: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK: account checked in CPI
    pub metadata: AccountInfo<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub mint: AccountInfo<'info>,
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(address = metaplex_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(data: CandyMachineData)]
pub struct InitializeCandyMachine<'info> {
    #[account(
        init,
        seeds=[PREFIX.as_bytes()],
        payer = authority,
        space =
            8  +  // discriminator
                  // \/ candy_machine
            8  + 8 + 8 + (40 * 1 /* multiply by n of creators */) + 8 + 2 + 9 +
            32 +  // authority
            32 +  // start date
            1,   // bump + bonus
        bump,
        constraint = candy_machine.to_account_info().owner == program_id
    )]
    pub candy_machine: Account<'info, CandyMachine>,

    /* the authority will also receive SOL from sales fees */
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCandyMachine<'info> {
    #[account(
        mut,
        has_one = authority,
    )]
    pub candy_machine: Account<'info, CandyMachine>,
    pub authority: Signer<'info>,
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
