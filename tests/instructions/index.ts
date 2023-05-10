import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { SwapProgram } from "../../target/types/swap_program";
import { toBigIntQuantity } from "../util/token";

export async function createPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey,
) {
    let signature = await program.methods.createPool()
        .accounts({
            pool: poolAddress,
            payer: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();
}

export async function fundPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey,
    mintAddress: PublicKey,
    quantity: number,
    decimals: number,
) {
    let signature = await program.methods.fundPool(
        new anchor.BN(toBigIntQuantity(quantity, decimals).toString())
    )
        .accounts({
            pool: poolAddress,
            mint: mintAddress,
            poolTokenAccount: getAssociatedTokenAddressSync(mintAddress, poolAddress, true),
            payerTokenAccount: getAssociatedTokenAddressSync(mintAddress, payer.publicKey),
            payer: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();
}

export async function swap(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    pool: PublicKey,
    receiveMint: PublicKey,
    payMint: PublicKey,
    quantity: number,
    decimals: number,
) {
    let signature = await program.methods.swap(
        new anchor.BN(toBigIntQuantity(quantity, decimals).toString())
    )
        .accounts({
            pool,
            receiveMint,
            poolReceiveTokenAccount: getAssociatedTokenAddressSync(receiveMint, pool, true),
            payerReceiveTokenAccount: getAssociatedTokenAddressSync(receiveMint, payer.publicKey),
            payMint,
            poolPayTokenAccount: getAssociatedTokenAddressSync(payMint, pool, true),
            payerPayTokenAccount: getAssociatedTokenAddressSync(payMint, payer.publicKey),
            payer: payer.publicKey,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([payer])
        .rpc({ skipPreflight: true });
}