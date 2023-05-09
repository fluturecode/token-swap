import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { SwapProgram } from "../../target/types/swap_program";

export async function initCreatePool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey,
    assets: {name: string, quantity: number, address: PublicKey}[],
) {
    let signature = await program.methods.initializeCreatePool()
        .accounts({
            pool: poolAddress,
            mintCannon: assets[0].address,
            mintCompass: assets[1].address,
            mintFishingNet: assets[2].address,
            mintGold: assets[3].address,
            mintGrapplingHook: assets[4].address,
            mintGunpowder: assets[5].address,
            mintMusket: assets[6].address,
            mintRum: assets[7].address,
            mintTelescope: assets[8].address,
            mintTreasureMap: assets[9].address,
            poolCannon: getAssociatedTokenAddressSync(assets[0].address, poolAddress, true),
            poolCompass: getAssociatedTokenAddressSync(assets[1].address, poolAddress, true),
            poolFishingNet: getAssociatedTokenAddressSync(assets[2].address, poolAddress, true),
            poolGold: getAssociatedTokenAddressSync(assets[3].address, poolAddress, true),
            poolGrapplingHook: getAssociatedTokenAddressSync(assets[4].address, poolAddress, true),
            poolGunpowder: getAssociatedTokenAddressSync(assets[5].address, poolAddress, true),
            poolMusket: getAssociatedTokenAddressSync(assets[6].address, poolAddress, true),
            poolRum: getAssociatedTokenAddressSync(assets[7].address, poolAddress, true),
            poolTelescope: getAssociatedTokenAddressSync(assets[8].address, poolAddress, true),
            poolTreasureMap: getAssociatedTokenAddressSync(assets[9].address, poolAddress, true),
            payer: payer.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        })
        .signers([payer])
        .rpc({ skipPreflight: true });
}

export async function initFundPool(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey,
    assets: {name: string, quantity: number, address: PublicKey}[],
) {
    let signature = await program.methods.initializeFundPool(
        {
            fundAmountCannon: new anchor.BN(assets[0].quantity),
            fundAmountCompass: new anchor.BN(assets[1].quantity),
            fundAmountFishingNet: new anchor.BN(assets[2].quantity),
            fundAmountGold: new anchor.BN(assets[3].quantity),
            fundAmountGrapplingHook: new anchor.BN(assets[4].quantity),
            fundAmountGunpowder: new anchor.BN(assets[5].quantity),
            fundAmountMusket: new anchor.BN(assets[6].quantity),
            fundAmountRum: new anchor.BN(assets[7].quantity),
            fundAmountTelescope: new anchor.BN(assets[8].quantity),
            fundAmountTreasureMap: new anchor.BN(assets[9].quantity),
        }
    )
        .accounts({
            pool: poolAddress,
            poolCannon: getAssociatedTokenAddressSync(assets[0].address, poolAddress, true),
            poolCompass: getAssociatedTokenAddressSync(assets[1].address, poolAddress, true),
            poolFishingNet: getAssociatedTokenAddressSync(assets[2].address, poolAddress, true),
            poolGold: getAssociatedTokenAddressSync(assets[3].address, poolAddress, true),
            poolGrapplingHook: getAssociatedTokenAddressSync(assets[4].address, poolAddress, true),
            poolGunpowder: getAssociatedTokenAddressSync(assets[5].address, poolAddress, true),
            poolMusket: getAssociatedTokenAddressSync(assets[6].address, poolAddress, true),
            poolRum: getAssociatedTokenAddressSync(assets[7].address, poolAddress, true),
            poolTelescope: getAssociatedTokenAddressSync(assets[8].address, poolAddress, true),
            poolTreasureMap: getAssociatedTokenAddressSync(assets[9].address, poolAddress, true),
            payerCannon: getAssociatedTokenAddressSync(assets[0].address, payer.publicKey),
            payerCompass: getAssociatedTokenAddressSync(assets[1].address, payer.publicKey),
            payerFishingNet: getAssociatedTokenAddressSync(assets[2].address, payer.publicKey),
            payerGold: getAssociatedTokenAddressSync(assets[3].address, payer.publicKey),
            payerGrapplingHook: getAssociatedTokenAddressSync(assets[4].address, payer.publicKey),
            payerGunpowder: getAssociatedTokenAddressSync(assets[5].address, payer.publicKey),
            payerMusket: getAssociatedTokenAddressSync(assets[6].address, payer.publicKey),
            payerRum: getAssociatedTokenAddressSync(assets[7].address, payer.publicKey),
            payerTelescope: getAssociatedTokenAddressSync(assets[8].address, payer.publicKey),
            payerTreasureMap: getAssociatedTokenAddressSync(assets[9].address, payer.publicKey),
            payer: payer.publicKey,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();
}

export async function swap(
    program: anchor.Program<SwapProgram>,
    payer: Keypair,
    poolAddress: PublicKey,
    assets: {name: string, quantity: number, address: PublicKey}[],
    receiveMint: PublicKey,
    payMint: PublicKey,
    payAmount: number,
) {
    let signature = await program.methods.swap(
        new anchor.BN(payAmount)
    )
        .accounts({
            pool: poolAddress,
            poolCannon: getAssociatedTokenAddressSync(assets[0].address, poolAddress, true),
            poolCompass: getAssociatedTokenAddressSync(assets[1].address, poolAddress, true),
            poolFishingNet: getAssociatedTokenAddressSync(assets[2].address, poolAddress, true),
            poolGold: getAssociatedTokenAddressSync(assets[3].address, poolAddress, true),
            poolGrapplingHook: getAssociatedTokenAddressSync(assets[4].address, poolAddress, true),
            poolGunpowder: getAssociatedTokenAddressSync(assets[5].address, poolAddress, true),
            poolMusket: getAssociatedTokenAddressSync(assets[6].address, poolAddress, true),
            poolRum: getAssociatedTokenAddressSync(assets[7].address, poolAddress, true),
            poolTelescope: getAssociatedTokenAddressSync(assets[8].address, poolAddress, true),
            poolTreasureMap: getAssociatedTokenAddressSync(assets[9].address, poolAddress, true),
            receiveMint: receiveMint,
            poolReceiveTokenAccount: getAssociatedTokenAddressSync(receiveMint, poolAddress),
            payerReceiveTokenAccount: getAssociatedTokenAddressSync(receiveMint, payer.publicKey),
            payMint: payMint,
            poolPayTokenAccount: getAssociatedTokenAddressSync(payMint, poolAddress),
            payerPayTokenAccount: getAssociatedTokenAddressSync(payMint, payer.publicKey),
            payer: payer.publicKey,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .signers([payer])
        .rpc();
}