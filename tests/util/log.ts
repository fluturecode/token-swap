import * as anchor from "@coral-xyz/anchor";
import { 
    Account as TokenAccount,
    getAssociatedTokenAddressSync,
    getAccount as getTokenAccount,
 } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js"

function lineBreak() {
    console.log("-----------------------------------------------------")
}

export function logNewMint(
    name: string,
    decimals: number,
    quantity: number,
    mint: PublicKey,
    signature: string,
) {
    lineBreak();
    console.log(`   Mint: ${name}`);
    console.log(`       Address:    ${mint.toBase58()}`);
    console.log(`       Decimals:   ${decimals}`);
    console.log(`       Quantity:   ${quantity}`);
    console.log(`       Transaction Signature: ${signature}`);
    lineBreak();
}

export async function logTokenBalance(connection: Connection, mint: PublicKey, owner: PublicKey, desc: string) {
    const tokenAccount = await getTokenAccount(connection, getAssociatedTokenAddressSync(mint, owner));
    lineBreak();
    console.log(`   Associated Token Account: ${desc}`);
    console.log(`       Address:    ${tokenAccount.address.toBase58()}`);
    console.log(`       Mint:       ${tokenAccount.mint}`);
    console.log(`       Balance:    ${new Number(tokenAccount.amount)}`);
    lineBreak();
}

export function logPool(
    poolAddress: PublicKey,
    pool: anchor.IdlTypes<anchor.Idl>["LiquidityPool"],
    tokenAccounts: TokenAccount[],
    k: bigint,
) {
    lineBreak();
    console.log("   Liquidity Pool:");
    console.log();
    console.log(`       Address:    ${poolAddress.toBase58()}`);
    console.log("       Mints Supported:");
    for (const mint of pool.assets) {
        console.log(`                   ${mint}`);
    }
    console.log();
    console.log("   Liquidity Pool Token Accounts:");
    console.log();
    for (const tokenAccount of tokenAccounts) {
        console.log(`       Address:    ${tokenAccount.address.toBase58()}`);
        console.log(`       Mint:       ${tokenAccount.mint.toBase58()}`);
        console.log(`       Balance:    ${tokenAccount.amount.toString()}`);
        console.log();
    }
    logK(k);
    lineBreak();
}

export function logK(k: bigint) {
    console.log(`   ** Constant-Product (K): ${k.toString()}`);
}

export function logChangeInK(changeInK: string) {
    console.log(`   ** Δ Change in Constant-Product (K): ${changeInK}`);
}