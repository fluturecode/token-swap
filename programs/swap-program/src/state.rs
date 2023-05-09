//! Swap program account state
use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Token, TokenAccount, Transfer};

use crate::error::SwapProgramError;

/// The account state of the `LiquidityPool`
///
/// It stores the mint addresses of each associated asset after being
/// initialized
#[account]
pub struct LiquidityPool {
    pub mint_cannon: Pubkey,
    pub mint_compass: Pubkey,
    pub mint_fishing_net: Pubkey,
    pub mint_gold: Pubkey,
    pub mint_grappling_hook: Pubkey,
    pub mint_gunpowder: Pubkey,
    pub mint_musket: Pubkey,
    pub mint_rum: Pubkey,
    pub mint_telescope: Pubkey,
    pub mint_treasure_map: Pubkey,
    pub bump: u8,
}

impl LiquidityPool {
    pub const SEED_PREFIX: &'static str = "liquidity_pool";

    /// Anchor discriminator + (Pubkey * 10) + u8
    pub const SPACE: usize = 8 + (32 * 10) + 1;

    /// Constant-Product (K)
    pub const K: u64 = 10000;

    /// Validate all associated mint addresses for the token accounts in the
    /// provided `assets` array match the mint addresses stored in the
    /// `LiquidityPool` account and are in the correct order
    pub fn check_asset_keys(&self, assets: &[&Account<'_, TokenAccount>; 10]) -> Result<()> {
        assert_key(&assets[0].mint, &self.mint_cannon)?;
        assert_key(&assets[1].mint, &self.mint_compass)?;
        assert_key(&assets[2].mint, &self.mint_fishing_net)?;
        assert_key(&assets[3].mint, &self.mint_gold)?;
        assert_key(&assets[4].mint, &self.mint_grappling_hook)?;
        assert_key(&assets[5].mint, &self.mint_gunpowder)?;
        assert_key(&assets[6].mint, &self.mint_musket)?;
        assert_key(&assets[7].mint, &self.mint_rum)?;
        assert_key(&assets[8].mint, &self.mint_telescope)?;
        assert_key(&assets[9].mint, &self.mint_treasure_map)?;
        Ok(())
    }

    /// Fund the liquidity pool by transferring tokens from the payer's token
    /// accounts to the pool's token accounts
    pub fn fund<'info>(
        deposits: [(
            &Account<'info, TokenAccount>,
            &Account<'info, TokenAccount>,
            u64,
        ); 10],
        authority: &Signer<'info>,
        token_program: &Program<'info, Token>,
    ) -> Result<()> {
        for (from, to, amount) in deposits {
            process_transfer_to_pool(from, to, amount, authority, token_program)?;
        }
        Ok(())
    }

    /// Process a swap by using the constant-product algorithm `f(p)` to
    /// determine the allowed amount of the receiving asset that can be returned
    /// in exchange for the amount of the paid asset offered then transferring
    /// both assets between the pool and payer
    pub fn process_swap<'info>(
        receive: (&Account<'info, TokenAccount>, &Account<'info, TokenAccount>),
        pay: (
            &Account<'info, TokenAccount>,
            &Account<'info, TokenAccount>,
            &Signer<'info>,
            u64,
        ),
        pool: &Account<'info, LiquidityPool>,
        token_program: &Program<'info, Token>,
    ) -> Result<()> {
        // (From, To)
        let (pool_recieve, payer_recieve) = receive;
        assert_mints(&payer_recieve.mint, &payer_recieve.mint)?;
        // (From, To)
        let (payer_pay, pool_pay, pay_authority, pay_amount) = pay;
        assert_mints(&payer_pay.mint, &pool_pay.mint)?;
        // Determine the amount the payer will recieve of the requested asset
        let receive_amount =
            determine_swap_receive(pool_recieve.amount, pool_pay.amount, pay_amount)?;
        // Process the swap
        process_transfer_to_pool(
            payer_pay,
            pool_pay,
            pay_amount,
            pay_authority,
            token_program,
        )?;
        process_transfer_from_pool(
            pool_recieve,
            payer_recieve,
            receive_amount,
            pool,
            token_program,
        )?;
        Ok(())
    }

    /// Ensure that the balances of tokens in all token accounts owned by the
    /// pool meet the constant-product value `K`
    pub fn assert_constant_product(assets: &[&Account<'_, TokenAccount>; 10]) -> Result<()> {
        match get_checked_product(assets) {
            Some(product) => {
                if product == Self::K {
                    Ok(())
                } else {
                    Err(SwapProgramError::InvalidSwap.into())
                }
            }
            None => Err(SwapProgramError::InvalidArithmetic.into()),
        }
    }
}

/// Asserts an asset's mint address matches a mint address stored in the
/// `LiquidityPool` account
fn assert_key(key: &Pubkey, check: &Pubkey) -> Result<()> {
    if !key.eq(check) {
        return Err(SwapProgramError::InvalidAssetKey.into());
    }
    Ok(())
}

/// Assert's the mint addresses on two token accounts match
fn assert_mints(mint1: &Pubkey, mint2: &Pubkey) -> Result<()> {
    if !mint1.eq(mint2) {
        return Err(SwapProgramError::MintMismatch.into());
    }
    Ok(())
}

/// Calculates the product of all asset balances using checked multiplication to
/// catch overflows of the `u64` type
fn get_checked_product(assets: &[&Account<'_, TokenAccount>; 10]) -> Option<u64> {
    assets[0]
        .amount
        .checked_mul(assets[1].amount)?
        .checked_mul(assets[2].amount)?
        .checked_mul(assets[3].amount)?
        .checked_mul(assets[4].amount)?
        .checked_mul(assets[5].amount)?
        .checked_mul(assets[6].amount)?
        .checked_mul(assets[7].amount)?
        .checked_mul(assets[8].amount)?
        .checked_mul(assets[9].amount)
}

/// Process a transfer from one of the payer's token accounts to one of the
/// pool's token accounts using a CPI
fn process_transfer_to_pool<'info>(
    from: &Account<'info, TokenAccount>,
    to: &Account<'info, TokenAccount>,
    amount: u64,
    authority: &Signer<'info>,
    token_program: &Program<'info, Token>,
) -> Result<()> {
    transfer(
        CpiContext::new(
            token_program.to_account_info(),
            Transfer {
                from: from.to_account_info(),
                to: to.to_account_info(),
                authority: authority.to_account_info(),
            },
        ),
        amount,
    )
}

/// Process a transfer from one of the pool's token accounts to one of the
/// payer's token accounts using a CPI with signer seeds
fn process_transfer_from_pool<'info>(
    from: &Account<'info, TokenAccount>,
    to: &Account<'info, TokenAccount>,
    amount: u64,
    pool: &Account<'info, LiquidityPool>,
    token_program: &Program<'info, Token>,
) -> Result<()> {
    transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: from.to_account_info(),
                to: to.to_account_info(),
                authority: pool.to_account_info(),
            },
            &[&[LiquidityPool::SEED_PREFIX.as_bytes(), &[pool.bump]]],
        ),
        amount,
    )
}

/// The algorithm `f(p)` to determine the allowed amount of the receiving asset
/// that can be returned in exchange for the amount of the paid asset offered
///
/// r = f(p) = (R * p) / (P + p)
fn determine_swap_receive(
    pool_recieve_balance: u64,
    pool_pay_balance: u64,
    pay_amount: u64,
) -> Result<u64> {
    let r_p = match pool_recieve_balance.checked_mul(pay_amount) {
        Some(val) => val,
        None => return Err(SwapProgramError::InvalidArithmetic.into()),
    };
    let p_p = match pool_pay_balance.checked_add(pay_amount) {
        Some(val) => val,
        None => return Err(SwapProgramError::InvalidArithmetic.into()),
    };
    match r_p.checked_div(p_p) {
        Some(val) => Ok(val),
        None => Err(SwapProgramError::InvalidArithmetic.into()),
    }
}
