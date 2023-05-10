//! Swap program errors
use anchor_lang::prelude::*;

#[error_code]
pub enum SwapProgramError {
    /// Some arithmetic operation has caused the resulting number to be too
    /// large for a `u64` value, thus overflowing it
    #[msg("Math overflow on `u64` value")]
    InvalidArithmetic,

    /// The mint address of the asset provided does not match any mint addresses
    /// stored in the `LiquidityPool` state, thus that asset has not been
    /// provided as liquidity to the pool and cannot be swapped
    #[msg("An invalid asset mint address was provided")]
    InvalidAssetKey,

    /// The amount of the "pay" asset that a user has proposed to pay results,
    /// after calculation of the function `r = f(p)`, in a value for `r` that is
    /// less than 0, thus no assets will be moved and this swap will be rejected
    #[msg("The amount proposed to pay is not great enough for at least 1 returned asset quantity")]
    InvalidSwapNotEnoughPay,
}
