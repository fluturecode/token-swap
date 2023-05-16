import useAssetsStore from '@/stores/useAssetsStore'
import { useWallet } from '@solana/wallet-adapter-react'
import CreateSwap from '@/components/CreateSwap'
import LoanCard from '@/components/AssetCard'
import useAnchorProgram from '@/hooks/useAnchorProgram'
import { FC, useEffect } from 'react'

export const HomeView: FC = () => {
    const wallet = useWallet()
    const program = useAnchorProgram()
    const { assets, getAssets } = useAssetsStore()

    useEffect(() => {
        getAssets(program)
    }, [wallet, program])

    console.log('assets', assets)

    return (
        <div className="md:hero mx-auto p-4">
            <div className="md:hero-content flex flex-col">
                <div className="mt-6">
                    <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-cyan-300 mb-4">
                        Pirate Swap
                    </h1>
                </div>
                {assets && (
                    <div>
                        <CreateSwap assets={assets} />
                        <div className="text-left text-lg mb-2">
                            <h3>Pool Tokens</h3>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {assets.map((asset, i) => (
                                <LoanCard
                                    key={i}
                                    name={asset.name}
                                    symbol={asset.symbol}
                                    uri={asset.uri}
                                    balance={asset.balance}
                                    mint={asset.mint}
                                    poolTokenAccount={asset.poolTokenAccount}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
