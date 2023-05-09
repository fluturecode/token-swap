//! Instruction: InitializePriceData
use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};

use crate::state::*;

/// Arguments for the `initialize_fund_pool` instruction
#[derive(AnchorDeserialize, AnchorSerialize, Clone)]
pub struct InitializeFundPoolArgs {
    pub fund_amount_cannon: u64,
    pub fund_amount_compass: u64,
    pub fund_amount_fishing_net: u64,
    pub fund_amount_gold: u64,
    pub fund_amount_grappling_hook: u64,
    pub fund_amount_gunpowder: u64,
    pub fund_amount_musket: u64,
    pub fund_amount_rum: u64,
    pub fund_amount_telescope: u64,
    pub fund_amount_treasure_map: u64,
}

/// (2) Initialize the program by funding the liquidity pool with assets
pub fn initialize_fund_pool(
    ctx: Context<InitializeFundPool>,
    args: InitializeFundPoolArgs,
) -> Result<()> {
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

    // Fund the liquidity pool by transferring tokens from the payer's token
    // accounts to the pool's token accounts
    let deposits = [
        (
            &ctx.accounts.payer_cannon,
            &ctx.accounts.pool_cannon,
            args.fund_amount_cannon,
        ),
        (
            &ctx.accounts.payer_compass,
            &ctx.accounts.pool_compass,
            args.fund_amount_compass,
        ),
        (
            &ctx.accounts.payer_fishing_net,
            &ctx.accounts.pool_fishing_net,
            args.fund_amount_fishing_net,
        ),
        (
            &ctx.accounts.payer_gold,
            &ctx.accounts.pool_gold,
            args.fund_amount_gold,
        ),
        (
            &ctx.accounts.payer_grappling_hook,
            &ctx.accounts.pool_grappling_hook,
            args.fund_amount_grappling_hook,
        ),
        (
            &ctx.accounts.payer_gunpowder,
            &ctx.accounts.pool_gunpowder,
            args.fund_amount_gunpowder,
        ),
        (
            &ctx.accounts.payer_musket,
            &ctx.accounts.pool_musket,
            args.fund_amount_musket,
        ),
        (
            &ctx.accounts.payer_rum,
            &ctx.accounts.pool_rum,
            args.fund_amount_rum,
        ),
        (
            &ctx.accounts.payer_telescope,
            &ctx.accounts.pool_telescope,
            args.fund_amount_telescope,
        ),
        (
            &ctx.accounts.payer_treasure_map,
            &ctx.accounts.pool_treasure_map,
            args.fund_amount_treasure_map,
        ),
    ];
    LiquidityPool::fund(deposits, &ctx.accounts.payer, &ctx.accounts.token_program)?;

    // Ensure that the balances of tokens in all token accounts owned by the
    // pool meet the constant-product value `K`
    LiquidityPool::assert_constant_product(&assets)
}

#[derive(Accounts)]
pub struct InitializeFundPool<'info> {
    /// Liquidity Pool
    #[account(
        mut,
        seeds = [LiquidityPool::SEED_PREFIX.as_bytes()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LiquidityPool>,
    /// Liquidity Pool token accounts
    #[account(
        mut,
        token::mint = pool.mint_cannon,
        token::authority = pool,
    )]
    pub pool_cannon: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_compass,
        token::authority = pool,
    )]
    pub pool_compass: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_fishing_net,
        token::authority = pool,
    )]
    pub pool_fishing_net: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_gold,
        token::authority = pool,
    )]
    pub pool_gold: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_grappling_hook,
        token::authority = pool,
    )]
    pub pool_grappling_hook: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_gunpowder,
        token::authority = pool,
    )]
    pub pool_gunpowder: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_musket,
        token::authority = pool,
    )]
    pub pool_musket: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_rum,
        token::authority = pool,
    )]
    pub pool_rum: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_telescope,
        token::authority = pool,
    )]
    pub pool_telescope: Account<'info, TokenAccount>,
    #[account(
        mut,
        token::mint = pool.mint_treasure_map,
        token::authority = pool,
    )]
    pub pool_treasure_map: Account<'info, TokenAccount>,
    /// Asset initial liquidity provider
    #[account(mut)]
    pub payer: Signer<'info>,
    /// Liquidity provider token accounts
    #[account(mut)]
    pub payer_cannon: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_compass: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_fishing_net: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_gold: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_grappling_hook: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_gunpowder: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_musket: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_rum: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_telescope: Account<'info, TokenAccount>,
    #[account(mut)]
    pub payer_treasure_map: Account<'info, TokenAccount>,
    /// Required programs
    pub token_program: Program<'info, Token>,
}
