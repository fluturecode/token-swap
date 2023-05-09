//! Swap program
#![allow(clippy::result_large_err)]
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod swap_program {
    use super::*;

    /// (1) Initialize the program by creating the liquidity pool and all
    /// associated token accounts for all assets
    pub fn initialize_create_pool(ctx: Context<InitializeCreatePool>) -> Result<()> {
        instructions::initialize_create_pool(ctx)
    }

    /// (2) Initialize the program by funding the liquidity pool with assets
    pub fn initialize_fund_pool(
        ctx: Context<InitializeFundPool>,
        args: InitializeFundPoolArgs,
    ) -> Result<()> {
        instructions::initialize_fund_pool(ctx, args)
    }

    /// Swap assets using the DEX
    pub fn swap(ctx: Context<Swap>, amount_to_swap: u64) -> Result<()> {
        instructions::swap(ctx, amount_to_swap)
    }
}
