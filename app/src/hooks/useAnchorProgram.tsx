import { AnchorProvider, Idl, Program } from '@coral-xyz/anchor'
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from '@solana/wallet-adapter-react'
import { SwapProgram } from '@/idl/swap_program'
import idlFile from '../idl/swap_program.json'

export default function useAnchorProgram(): Program<SwapProgram> {
    const { connection } = useConnection()
    const wallet = useAnchorWallet()

    const idl = idlFile as Idl

    const provider = new AnchorProvider(connection, wallet, {})
    return new Program(
        idl,
        idl.metadata.address,
        provider
    ) as Program<SwapProgram>
}
