import * as anchor from "@coral-xyz/anchor";
import { 
    Account as TokenAccount, 
    getAssociatedTokenAddressSync, 
    getMultipleAccounts as getMultipleTokenAccounts,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import { SwapProgram } from "../../target/types/swap_program";

export async function fetchPool(
    program: anchor.Program<SwapProgram>,
    poolAddress: PublicKey,
    ): Promise<anchor.IdlTypes<anchor.Idl>["LiquidityPool"]> {
        return program.account.liquidityPool.fetch(poolAddress) as anchor.IdlTypes<anchor.Idl>["LiquidityPool"];
}

export async function fetchPoolTokenAccounts(
    connection: Connection,
    poolAddress: PublicKey,
    pool: anchor.IdlTypes<anchor.Idl>["LiquidityPool"],
    ): Promise<TokenAccount[]> {
    const tokenAddresses = pool.assets.map(m => getAssociatedTokenAddressSync(m, poolAddress, true));
    return getMultipleTokenAccounts(connection, tokenAddresses);
}

export function calculateK(tokenAccounts: TokenAccount[]): bigint {
    return tokenAccounts.map(a => a.amount).reduce((product, i) => product * i);
}

export function calculateChangeInK(start: bigint, end: bigint): string {
    const startNum = Number(start);
    const endNum = Number(end);
    if (startNum === 0) {
        throw new Error("Cannot calculate percent change for a zero value.");
    }
    const change = endNum - startNum;
    const percentChange = (change / startNum) * 100;
    return percentChange.toFixed(4) + "%";
}