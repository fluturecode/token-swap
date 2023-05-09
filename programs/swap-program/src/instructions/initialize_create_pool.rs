//! Instruction: InitializePriceData
use anchor_lang::prelude::*;
use anchor_spl::{associated_token, token};

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
    // Liquidity Pool
    #[account(
        init,
        space = LiquidityPool::SPACE,
        payer = payer,
        seeds = [LiquidityPool::SEED_PREFIX.as_bytes()],
        bump,
    )]
    pub pool: Account<'info, LiquidityPool>,
    // Asset mints
    pub mint_cannon: Box<Account<'info, token::Mint>>,
    pub mint_compass: Box<Account<'info, token::Mint>>,
    pub mint_fishing_net: Box<Account<'info, token::Mint>>,
    pub mint_gold: Box<Account<'info, token::Mint>>,
    pub mint_grappling_hook: Box<Account<'info, token::Mint>>,
    pub mint_gunpowder: Box<Account<'info, token::Mint>>,
    pub mint_musket: Box<Account<'info, token::Mint>>,
    pub mint_rum: Box<Account<'info, token::Mint>>,
    pub mint_telescope: Box<Account<'info, token::Mint>>,
    pub mint_treasure_map: Box<Account<'info, token::Mint>>,
    // Liquidity Pool token accounts
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_cannon,
        associated_token::authority = pool,
    )]
    pub pool_cannon: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_compass,
        associated_token::authority = pool,
    )]
    pub pool_compass: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_fishing_net,
        associated_token::authority = pool,
    )]
    pub pool_fishing_net: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_gold,
        associated_token::authority = pool,
    )]
    pub pool_gold: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_grappling_hook,
        associated_token::authority = pool,
    )]
    pub pool_grappling_hook: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_gunpowder,
        associated_token::authority = pool,
    )]
    pub pool_gunpowder: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_musket,
        associated_token::authority = pool,
    )]
    pub pool_musket: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_rum,
        associated_token::authority = pool,
    )]
    pub pool_rum: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_telescope,
        associated_token::authority = pool,
    )]
    pub pool_telescope: Box<Account<'info, token::TokenAccount>>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint_treasure_map,
        associated_token::authority = pool,
    )]
    pub pool_treasure_map: Box<Account<'info, token::TokenAccount>>,
    // Asset initial liquidity provider
    #[account(mut)]
    pub payer: Signer<'info>,
    // Required programs
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}
