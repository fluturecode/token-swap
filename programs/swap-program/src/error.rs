//! Swap program errors
use anchor_lang::prelude::*;

#[error_code]
pub enum SwapProgramError {
    #[msg("Pool's constant product was not met")]
    InvalidArithmetic,

    #[msg("Swap would result in a false constant product for pool")]
    InvalidSwap,

    #[msg("An invalid asset mint address was provided")]
    InvalidAssetKey,

    #[msg("Mints do not match for swap")]
    MintMismatch,
}
