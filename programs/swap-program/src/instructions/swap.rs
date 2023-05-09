//! Instruction: SwapDia
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::*;

/// Swap assets using the DEX
pub fn swap(ctx: Context<Swap>, amount_to_swap: u64) -> Result<()> {
    // Validate all associated mint addresses for the token accounts in the
    // provided `assets` array match the mint addresses stored in the
    // `LiquidityPool` account and are in the correct order
    let pool = &ctx.accounts.pool;
    let assets = [
        &ctx.accounts.pool_cannon,
        &ctx.accounts.pool_compass,
        &ctx.accounts.pool_fishing_net,
        &ctx.accounts.pool_gold,
        &ctx.accounts.pool_grappling_hook,
        &ctx.accounts.pool_gunpowder,
        &ctx.accounts.pool_musket,
        &ctx.accounts.pool_rum,
        &ctx.accounts.pool_telescope,
        &ctx.accounts.pool_treasure_map,
    ];
    pool.check_asset_keys(&assets)?;

    // Process a swap by using the constant-product algorithm `f(p)` to
    // determine the allowed amount of the receiving asset that can be returned
    // in exchange for the amount of the paid asset offered then transferring
    // both assets between the pool and payer
    LiquidityPool::process_swap(
        (
            &ctx.accounts.pool_receive_token_account,
            &ctx.accounts.payer_receive_token_account,
        ),
        (
            &ctx.accounts.payer_pay_token_account,
            &ctx.accounts.pool_pay_token_account,
            &ctx.accounts.payer,
            amount_to_swap,
        ),
        pool,
        &ctx.accounts.token_program,
    )?;

    // Ensure that the balances of tokens in all token accounts owned by the
    // pool meet the constant-product value `K`
    LiquidityPool::assert_constant_product(&assets)
}

#[derive(Accounts)]
pub struct Swap<'info> {
    /// Liquidity Pool
    #[account(
        mut,
        seeds = [LiquidityPool::SEED_PREFIX.as_bytes()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LiquidityPool>,
    /// Liquidity Pool token accounts
    #[account(
        token::mint = pool.mint_cannon,
        token::authority = pool,
    )]
    pub pool_cannon: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_compass,
        token::authority = pool,
    )]
    pub pool_compass: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_fishing_net,
        token::authority = pool,
    )]
    pub pool_fishing_net: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_gold,
        token::authority = pool,
    )]
    pub pool_gold: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_grappling_hook,
        token::authority = pool,
    )]
    pub pool_grappling_hook: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_gunpowder,
        token::authority = pool,
    )]
    pub pool_gunpowder: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_musket,
        token::authority = pool,
    )]
    pub pool_musket: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_rum,
        token::authority = pool,
    )]
    pub pool_rum: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_telescope,
        token::authority = pool,
    )]
    pub pool_telescope: Account<'info, TokenAccount>,
    #[account(
        token::mint = pool.mint_treasure_map,
        token::authority = pool,
    )]
    pub pool_treasure_map: Account<'info, TokenAccount>,
    /// The "receive" asset - requesting to receive in exchange
    pub receive_mint: Account<'info, Mint>,
    #[account(
        mut,
        token::mint = receive_mint,
        token::authority = pool,
    )]
    pub pool_receive_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = receive_mint,
        token::authority = payer,
    )]
    pub payer_receive_token_account: Account<'info, TokenAccount>,
    /// The "pay" asset - requesting to be exchanged
    pub pay_mint: Account<'info, Mint>,
    #[account(
        mut,
        token::mint = pay_mint,
        token::authority = pool,
    )]
    pub pool_pay_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pay_mint,
        token::authority = payer,
    )]
    pub payer_pay_token_account: Account<'info, TokenAccount>,
    /// The authority requesting to swap (user)
    #[account(mut)]
    pub payer: Signer<'info>,
    /// Required programs
    pub token_program: Program<'info, Token>,
}
