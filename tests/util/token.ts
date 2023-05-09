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
    SystemProgram, 
} from "@solana/web3.js";
import { buildTransaction } from "./transaction";
import { logNewMint } from "./log";

export async function mintNewTokens(
    asset: string,
    connection: Connection,
    mintKeypair: Keypair,
    payer: Keypair,
    quantity: number,
) {
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
        9,
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
        quantity,
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
    logNewMint(asset.toUpperCase(), mintKeypair.publicKey, signature);
}
