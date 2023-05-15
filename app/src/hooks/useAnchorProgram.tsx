import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { SwapProgram } from '@/idl/swap_program';
import idl from '../idl/swap_program.json';

export default function useAnchorProgram(): Program<SwapProgram> {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = new AnchorProvider(connection, wallet, {});
    return new Program(
        idl as Idl,
        idl.metadata.address,
        provider,
    ) as Program<SwapProgram>;
}
