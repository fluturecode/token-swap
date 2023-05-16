import { PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { FC, useState } from 'react'
interface Asset {
    name: string
    symbol: string
    uri: string
    balance: number
    mint: PublicKey
    poolTokenAccount: PublicKey
}

interface TokenSwapProps {
    assets: Asset[]
}

const CreateSwap: React.FC<TokenSwapProps> = ({ assets }) => {
    const tokens = assets
    const router = useRouter()
    const [fromToken, setFromToken] = useState(tokens[0])
    const [toToken, setToToken] = useState(tokens[1])

    console.log('asset', assets)

    const handleSwap = () => {
        setFromToken(toToken)
        setToToken(fromToken)
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
                        className="p-2 rounded border"
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
                        Swap
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
                        className="p-2 rounded border"
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
            </div>
        </div>
    )
}

export default CreateSwap
