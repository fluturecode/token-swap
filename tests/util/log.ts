import { Account, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { 
    AccountInfo,
    Connection, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey 
} from "@solana/web3.js"

function lineBreak() {
    console.log("-----------------------------------------------------")
}

export function logNewMint(asset: string, mintPubkey: PublicKey, signature: string) {
    lineBreak();
    console.log(`   Mint: ${asset}`);
    console.log(`       Address:    ${mintPubkey.toBase58()}`);
    console.log(`       Transaction Signature: ${signature}`);
    lineBreak();
}

export async function logTokenBalance(accountName: string, associatedTokenAccount: Account) {
    lineBreak();
    console.log(`   Associated Token Account: ${accountName}`);
    console.log(`       Address:    ${associatedTokenAccount.address.toBase58()}`);
    console.log(`       Mint:       ${associatedTokenAccount.mint}`);
    console.log(`       Balance:    ${new Number(associatedTokenAccount.amount)}`);
    lineBreak();
}
