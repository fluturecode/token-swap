//! Instruction: SwapDia
use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::state::*;

/// Swap assets using the DEX
pub fn swap(ctx: Context<Swap>, amount_to_swap: u64) -> Result<()> {
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
    // Liquidity Pool
    #[account(
        mut,
        seeds = [LiquidityPool::SEED_PREFIX.as_bytes()],
        bump = pool.bump,
    )]
    pub pool: Account<'info, LiquidityPool>,
    // Liquidity Pool token accounts
    #[account(
        associated_token::mint = pool.mint_cannon,
        associated_token::authority = pool,
    )]
    pub pool_cannon: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_compass,
        associated_token::authority = pool,
    )]
    pub pool_compass: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_fishing_net,
        associated_token::authority = pool,
    )]
    pub pool_fishing_net: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_gold,
        associated_token::authority = pool,
    )]
    pub pool_gold: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_grappling_hook,
        associated_token::authority = pool,
    )]
    pub pool_grappling_hook: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_gunpowder,
        associated_token::authority = pool,
    )]
    pub pool_gunpowder: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_musket,
        associated_token::authority = pool,
    )]
    pub pool_musket: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_rum,
        associated_token::authority = pool,
    )]
    pub pool_rum: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_telescope,
        associated_token::authority = pool,
    )]
    pub pool_telescope: Box<Account<'info, token::TokenAccount>>,
    #[account(
        associated_token::mint = pool.mint_treasure_map,
        associated_token::authority = pool,
    )]
    pub pool_treasure_map: Box<Account<'info, token::TokenAccount>>,
    // The "receive" asset - requesting to receive in exchange
    pub receive_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = receive_mint,
        associated_token::authority = pool,
    )]
    pub pool_receive_token_account: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = receive_mint,
        associated_token::authority = payer,
    )]
    pub payer_receive_token_account: Box<Account<'info, token::TokenAccount>>,
    // The "pay" asset - requesting to be exchanged
    pub pay_mint: Box<Account<'info, token::Mint>>,
    #[account(
        mut,
        associated_token::mint = pay_mint,
        associated_token::authority = pool,
    )]
    pub pool_pay_token_account: Box<Account<'info, token::TokenAccount>>,
    #[account(
        mut,
        associated_token::mint = pay_mint,
        associated_token::authority = payer,
    )]
    pub payer_pay_token_account: Box<Account<'info, token::TokenAccount>>,
    // The authority requesting to swap (user)
    #[account(mut)]
    pub payer: Signer<'info>,
    // Required programs
    pub token_program: Program<'info, token::Token>,
}
