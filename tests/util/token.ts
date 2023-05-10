import {
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction, 
    createMintToInstruction, 
    getAssociatedTokenAddressSync, 
    MINT_SIZE, 
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { 
    Connection,
    Keypair, 
    PublicKey, 
    SystemProgram, 
} from "@solana/web3.js";
import { buildTransaction } from "./transaction";
import { logNewMint } from "./log";

export function toBigIntQuantity(quantity: number, decimals: number): bigint {
    return BigInt(quantity) * (BigInt(10) ** BigInt(decimals));
}

export async function mintNewTokens(
    connection: Connection,
    payer: Keypair,
    mintKeypair: Keypair,
    asset: [string, number, number],
) {
    const assetName = asset[0];
    const decimals = asset[1];
    const quantity = asset[2];

    const tokenAccount = getAssociatedTokenAddressSync(mintKeypair.publicKey, payer.publicKey);

    const createMintAccountIx = SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
        space: MINT_SIZE,
        programId: TOKEN_PROGRAM_ID,
    });
    const initializeMintIx = createInitializeMintInstruction(
        mintKeypair.publicKey,
        decimals,
        payer.publicKey,
        payer.publicKey,
    );
    const createAssociatedtokenAccountIx = createAssociatedTokenAccountInstruction(
        payer.publicKey,
        tokenAccount,
        payer.publicKey,
        mintKeypair.publicKey,
    );
    const mintToWalletIx = createMintToInstruction(
        mintKeypair.publicKey,
        tokenAccount,
        payer.publicKey,
        toBigIntQuantity(quantity, decimals),
    );

    const tx = await buildTransaction(
        connection, 
        payer.publicKey, 
        [payer, mintKeypair], 
        [
            createMintAccountIx, 
            initializeMintIx, 
            createAssociatedtokenAccountIx,
            mintToWalletIx,
        ],
    );
    const signature = await connection.sendTransaction(tx);
    logNewMint(assetName.toUpperCase(), decimals, quantity, mintKeypair.publicKey, signature);
}

export async function mintExistingTokens(
    connection: Connection,
    mint: PublicKey,
    payer: Keypair,
    quantity: number,
    decimals: number,
) {
    const tokenAccount = getAssociatedTokenAddressSync(mint, payer.publicKey);

    const mintToWalletIx = createMintToInstruction(
        mint,
        tokenAccount,
        payer.publicKey,
        toBigIntQuantity(quantity, decimals),
    );

    const tx = await buildTransaction(
        connection, 
        payer.publicKey, 
        [payer], 
        [mintToWalletIx],
    );
    const signature = await connection.sendTransaction(tx);
}