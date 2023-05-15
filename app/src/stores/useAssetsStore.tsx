import { Program } from '@coral-xyz/anchor';
import { PROGRAM_ID as METADATA_PROGRAM_ID, Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';
import { SwapProgram } from '@/idl/swap_program';
import { create } from 'zustand';
import { getAssociatedTokenAddressSync, getMultipleAccounts as getMultipleTokenAccounts } from '@solana/spl-token';

// Seed prefix for the Liquidity Pool from our program
const LIQUIDITY_POOL_SEED_PREFIX = 'liquidity_pool'

const getPoolAddress = (programId: PublicKey) => PublicKey.findProgramAddressSync(
    [Buffer.from(LIQUIDITY_POOL_SEED_PREFIX)],
    programId,
)[0]

const getMetadataAddress = (programId: PublicKey, mint: PublicKey) => PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID
)[0]

interface Asset {
    name: string,
    symbol: string,
    uri: string,
    balance: number,
    mint: PublicKey,
    poolTokenAccount: PublicKey,
}

interface AssetsStore {
    assets: Asset[];
    getAssets: (program: Program<SwapProgram>) => void;
}

const useAssetsStore = create<AssetsStore>((set, _get) => ({
    assets: [],
    getAssets: async (program: Program<SwapProgram>) => {
        let assets: Asset[] = [];
        try {
            const poolAddress = getPoolAddress(program.programId)
            const pool = await program.account.liquidityPool.fetch(poolAddress)
            let metadataAddresses: PublicKey[] = [];
            let tokenAccountAddresses: PublicKey[] = [];
            pool.assets.forEach((m) => {
                metadataAddresses.push(getMetadataAddress(program.programId, m))
                tokenAccountAddresses.push(getAssociatedTokenAddressSync(m, poolAddress, true))
            })
            const poolTokenAccounts = await getMultipleTokenAccounts(program.provider.connection, tokenAccountAddresses)
            const metadataAccounts = (await program.provider.connection.getMultipleAccountsInfo(metadataAddresses)).map((accountInfo) => 
                accountInfo != null ? Metadata.deserialize(accountInfo?.data) : null
            )
            assets = poolTokenAccounts.map((account) => {
                const metadataAccount = metadataAccounts.find((m) => m?.[0].mint.equals(account.mint))
                const [name, symbol, uri] = metadataAccount 
                    ? [metadataAccount[0].data.name, metadataAccount[0].data.symbol, metadataAccount[0].data.uri]
                    : ['Unknown Asset', 'UNKN', '']
                return {
                    name,
                    symbol,
                    uri,
                    balance: Number(account.amount),
                    mint: account.mint,
                    poolTokenAccount: account.address,
                }
            })
            console.log(`Asset Count: ${assets.length}`);
        } catch (e) {
            console.log(`error fetching assets: `, e);
        }
        set({
            assets,
        });
    },
}));

export default useAssetsStore;