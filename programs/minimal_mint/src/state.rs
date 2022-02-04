use anchor_lang::prelude::*;

#[repr(C)]
#[derive(AnchorDeserialize, AnchorSerialize, PartialEq, Debug, Clone)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}

#[account]
#[derive(Default)]
pub struct CandyMachine {
    pub authority: Pubkey,
    pub wallet: Pubkey,
    pub data: CandyMachineData,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub struct CandyMachineData {
    pub price: u64,
    pub nfts_minted: u64,
    pub go_live_date: Option<i64>,
    pub creators: Vec<Creator>,
    pub symbol: String,
    pub seller_fee_basis_points: u16,
    pub max_supply: Option<u64>,
}

/* seeds of the PDA, can be anything you want */
/* remember to change them on the JS too (utils.ts file) */
pub static PREFIX: &str = "yglHzkU";
pub static SUFIX: &str = "FKs9tP0";