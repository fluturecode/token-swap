//! Instruction: InitializePriceData
use anchor_lang::prelude::*;
use anchor_spl::token;

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
        ctx.accounts.pool_cannon.as_ref(),
        ctx.accounts.pool_compass.as_ref(),
        ctx.accounts.pool_fishing_net.as_ref(),
        ctx.accounts.pool_gold.as_ref(),
        ctx.accounts.pool_grappling_hook.as_ref(),
        ctx.accounts.pool_gunpowder.as_ref(),
        ctx.accounts.pool_musket.as_ref(),
        ctx.accounts.pool_rum.as_ref(),
        ctx.accounts.pool_telescope.as_ref(),
        ctx.accounts.pool_treasure_map.as_ref(),
    ];
    pool.check_asset_keys(&assets)?;

    // Fund the liquidity pool by transferring tokens from the payer's token
    // accounts to the pool's token accounts
    let deposits = [
        (
            ctx.accounts.payer_cannon.as_ref(),
            ctx.accounts.pool_cannon.as_ref(),
            args.fund_amount_cannon,
        ),
        (
            ctx.accounts.payer_compass.as_ref(),
            ctx.accounts.pool_compass.as_ref(),
            args.fund_amount_compass,
        ),
        (
            ctx.accounts.payer_fishing_net.as_ref(),
            ctx.accounts.pool_fishing_net.as_ref(),
            args.fund_amount_fishing_net,
        ),
        (
            ctx.accounts.payer_gold.as_ref(),
            ctx.accounts.pool_gold.as_ref(),
            args.fund_amount_gold,
        ),
        (
            ctx.accounts.payer_grappling_hook.as_ref(),
            ctx.accounts.pool_grappling_hook.as_ref(),
            args.fund_amount_grappling_hook,
        ),
        (
            ctx.accounts.payer_gunpowder.as_ref(),
            ctx.accounts.pool_gunpowder.as_ref(),
            args.fund_amount_gunpowder,
        ),
        (
            ctx.accounts.payer_musket.as_ref(),
            ctx.accounts.pool_musket.as_ref(),
            args.fund_amount_musket,
        ),
        (
            ctx.accounts.payer_rum.as_ref(),
            ctx.accounts.pool_rum.as_ref(),
            args.fund_amount_rum,
        ),
        (
            ctx.accounts.payer_telescope.as_ref(),
            ctx.accounts.pool_telescope.as_ref(),
            args.fund_amount_telescope,
        ),
        (
            ctx.accounts.payer_treasure_map.as_ref(),
            ctx.accounts.pool_treasure_map.as_ref(),
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
    // Liquidity Pool
    #[account(
        mut,
        seeds = [LiquidityPool::SEED_PREFIX.as_bytes()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LiquidityPool>,
    // Liquidity Pool token accounts
    #[account(
        mut,
        associated_token::mint = pool.mint_cannon,
        associated_token::authority = pool,
    )]
    pub pool_cannon: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_compass,
        associated_token::authority = pool,
    )]
    pub pool_compass: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_fishing_net,
        associated_token::authority = pool,
    )]
    pub pool_fishing_net: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_gold,
        associated_token::authority = pool,
    )]
    pub pool_gold: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_grappling_hook,
        associated_token::authority = pool,
    )]
    pub pool_grappling_hook: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_gunpowder,
        associated_token::authority = pool,
    )]
    pub pool_gunpowder: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_musket,
        associated_token::authority = pool,
    )]
    pub pool_musket: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_rum,
        associated_token::authority = pool,
    )]
    pub pool_rum: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_telescope,
        associated_token::authority = pool,
    )]
    pub pool_telescope: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_treasure_map,
        associated_token::authority = pool,
    )]
    pub pool_treasure_map: Box<Account<'info, token::TokenAccount>>,
    // Asset initial liquidity provider
    #[account(mut)]
    pub payer: Signer<'info>,
    // Liquidity provider token accounts
    #[account(
        mut,
        associated_token::mint = pool.mint_cannon,
        associated_token::authority = pool,
    )]
    pub payer_cannon: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_compass,
        associated_token::authority = pool,
    )]
    pub payer_compass: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_fishing_net,
        associated_token::authority = pool,
    )]
    pub payer_fishing_net: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_gold,
        associated_token::authority = pool,
    )]
    pub payer_gold: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_grappling_hook,
        associated_token::authority = pool,
    )]
    pub payer_grappling_hook: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_gunpowder,
        associated_token::authority = pool,
    )]
    pub payer_gunpowder: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_musket,
        associated_token::authority = pool,
    )]
    pub payer_musket: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_rum,
        associated_token::authority = pool,
    )]
    pub payer_rum: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_telescope,
        associated_token::authority = pool,
    )]
    pub payer_telescope: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pool.mint_treasure_map,
        associated_token::authority = pool,
    )]
    pub payer_treasure_map: Box<Account<'info, token::TokenAccount>>,
    // Required programs
    pub token_program: Program<'info, token::Token>,
}
