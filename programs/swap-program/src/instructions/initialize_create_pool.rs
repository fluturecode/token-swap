//! Instruction: InitializePriceData
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::state::*;

/// (1) Initialize the program by creating the liquidity pool and all
/// associated token accounts for all assets
pub fn initialize_create_pool(ctx: Context<InitializeCreatePool>) -> Result<()> {
    // Store the mint addresses of each associated asset after being
    // initialized.
    ctx.accounts.pool.set_inner(LiquidityPool {
        mint_cannon: ctx.accounts.mint_cannon.key(),
        mint_compass: ctx.accounts.mint_compass.key(),
        mint_fishing_net: ctx.accounts.mint_fishing_net.key(),
        mint_gold: ctx.accounts.mint_gold.key(),
        mint_grappling_hook: ctx.accounts.mint_grappling_hook.key(),
        mint_gunpowder: ctx.accounts.mint_gunpowder.key(),
        mint_musket: ctx.accounts.mint_musket.key(),
        mint_rum: ctx.accounts.mint_rum.key(),
        mint_telescope: ctx.accounts.mint_telescope.key(),
        mint_treasure_map: ctx.accounts.mint_treasure_map.key(),
        bump: *ctx
            .bumps
            .get("pool")
            .expect("Failed to fetch bump for `pool`"),
    });
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeCreatePool<'info> {
    /// Liquidity Pool
    #[account(
        init,
        space = LiquidityPool::SPACE,
        payer = payer,
        seeds = [LiquidityPool::SEED_PREFIX.as_bytes()],
        bump,
    )]
    pub pool: Account<'info, LiquidityPool>,
    /// Asset mints
    pub mint_cannon: Account<'info, Mint>,
    pub mint_compass: Account<'info, Mint>,
    pub mint_fishing_net: Account<'info, Mint>,
    pub mint_gold: Account<'info, Mint>,
    pub mint_grappling_hook: Account<'info, Mint>,
    pub mint_gunpowder: Account<'info, Mint>,
    pub mint_musket: Account<'info, Mint>,
    pub mint_rum: Account<'info, Mint>,
    pub mint_telescope: Account<'info, Mint>,
    pub mint_treasure_map: Account<'info, Mint>,
    /// Liquidity Pool token accounts
    #[account(
        init,
        payer = payer,
        token::mint = mint_cannon,
        token::authority = pool,
    )]
    pub pool_cannon: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_compass,
        token::authority = pool,
    )]
    pub pool_compass: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_fishing_net,
        token::authority = pool,
    )]
    pub pool_fishing_net: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_gold,
        token::authority = pool,
    )]
    pub pool_gold: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_grappling_hook,
        token::authority = pool,
    )]
    pub pool_grappling_hook: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_gunpowder,
        token::authority = pool,
    )]
    pub pool_gunpowder: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_musket,
        token::authority = pool,
    )]
    pub pool_musket: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_rum,
        token::authority = pool,
    )]
    pub pool_rum: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_telescope,
        token::authority = pool,
    )]
    pub pool_telescope: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = payer,
        token::mint = mint_treasure_map,
        token::authority = pool,
    )]
    pub pool_treasure_map: Account<'info, TokenAccount>,
    /// Asset initial liquidity provider
    #[account(mut)]
    pub payer: Signer<'info>,
    /// Required programs
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
