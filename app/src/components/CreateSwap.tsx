import useAnchorProgram from '@/hooks/useAnchorProgram'
import { notify } from '@/utils/notifications'
import { BN } from '@coral-xyz/anchor'
import {
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import {
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
interface Asset {
    name: string
    symbol: string
    uri: string
    balance: number
    mint: PublicKey
    poolTokenAccount: PublicKey
    decimals: number
}

interface TokenSwapProps {
    assets: Asset[]
}

const CreateSwap: React.FC<TokenSwapProps> = ({ assets }) => {
    const tokens = assets
    const router = useRouter()
    const [fromToken, setFromToken] = useState(tokens[0])
    const [toToken, setToToken] = useState(tokens[1])
    const [amount, setAmount] = useState(0)
    const [receiveAmount, setReceiveAmount] = useState(0)
    const wallet = useWallet()
    useEffect(() => {
        // Calculate the receive amount based on the constant product formula
        const r = (toToken.balance * amount) / (fromToken.balance + amount)

        const adjustedR = r / Math.pow(10, toToken.decimals)

        setReceiveAmount(adjustedR)
    }, [amount, fromToken, toToken])

    const handleSwap = () => {
        setFromToken(toToken)
        setToToken(fromToken)
    }
    const program = useAnchorProgram()

    console.log(tokens[3].mint.toBase58())

    const swap = async () => {
        if (wallet.publicKey) {
            const LIQUIDITY_POOL_SEED_PREFIX = 'liquidity_pool'
            const poolAddress = PublicKey.findProgramAddressSync(
                [Buffer.from(LIQUIDITY_POOL_SEED_PREFIX)],
                program.programId
            )[0]

            const sig = await program.methods
                .swap(new BN(amount))
                .accounts({
                    pool: poolAddress,
                    receiveMint: toToken.mint,
                    poolReceiveTokenAccount: getAssociatedTokenAddressSync(
                        toToken.mint,
                        poolAddress,
                        true
                    ),
                    payerReceiveTokenAccount: getAssociatedTokenAddressSync(
                        toToken.mint,
                        wallet.publicKey,
                        true
                    ),
                    payMint: fromToken.mint,
                    poolPayTokenAccount: getAssociatedTokenAddressSync(
                        fromToken.mint,
                        poolAddress,
                        true
                    ),
                    payerPayTokenAccount: getAssociatedTokenAddressSync(
                        fromToken.mint,
                        wallet.publicKey
                    ),
                    payer: wallet.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc()
            notify({
                type: 'success',
                message: 'Swap successful!',
                txid: sig,
            })
        }
    }
    return (
        <div className="flex flex-row justify-center">
            <div className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <select
                        value={fromToken.symbol}
                        onChange={(e) => {
                            const selectedAsset = assets.find(
                                (asset) => asset.symbol === e.target.value
                            )
                            if (selectedAsset) {
                                setFromToken(selectedAsset)
                            }
                        }}
                        className="p-3 rounded-md border mx-2 bg-black text-white"
                    >
                        {assets.map(
                            (asset, index) =>
                                asset.symbol !== toToken.symbol && (
                                    <option key={index} value={asset.symbol}>
                                        {asset.name}
                                    </option>
                                )
                        )}
                    </select>

                    <button
                        onClick={handleSwap}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        🔁
                    </button>

                    <select
                        value={toToken.symbol}
                        onChange={(e) => {
                            const selectedAsset = assets.find(
                                (asset) => asset.symbol === e.target.value
                            )
                            if (selectedAsset) {
                                setToToken(selectedAsset)
                            }
                        }}
                        className="p-3 rounded-md border mx-2 bg-black text-white"
                    >
                        {assets.map(
                            (asset, index) =>
                                asset.symbol !== fromToken.symbol && (
                                    <option key={index} value={asset.symbol}>
                                        {asset.name}
                                    </option>
                                )
                        )}
                    </select>
                </div>
                <div>
                    <input
                        className="h-12 w-full bg-black rounded-lg p-2 "
                        placeholder="Amount"
                        type="number"
                        onChange={(e) =>
                            setAmount(
                                Number(e.target.value) *
                                    10 ** fromToken.decimals
                            )
                        }
                    ></input>
                    <div className="w-full bg-black text-white align-middle mt-2 h-12 rounded-lg p-2 items-center">
                        {receiveAmount}
                    </div>
                    <button
                        className="w-full bg-black hover:bg-slate-900 h-12 mt-2 rounded-lg"
                        onClick={swap}
                    >
                        Swap
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateSwap
