import { useNetworkConfiguration } from '@/contexts/NetworkConfigurationProvider'
import { PublicKey } from '@solana/web3.js'
import { request } from 'https'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'

interface AssetCardProps {
    name: string
    symbol: string
    uri: string
    balance: number
    mint: PublicKey
    poolTokenAccount: PublicKey
}

const LoanCard: FC<AssetCardProps> = (props: AssetCardProps) => {
    const { networkConfiguration } = useNetworkConfiguration()
    const [imagePath, setImagePath] = useState<string>('')

    async function getMetadataFromArweave(uri: string) {
        const data = await fetch(uri).then((data) => data.json())
        setImagePath(data.image)
    }

    useEffect(() => {
        getMetadataFromArweave(props.uri)
    }, [])

    return (
        <div className="w-auto pt-0 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="w-full text-right my-0 mb-2">
                <a
                    className="inline-flex mt-3 ml-2 items-center text-sm font-medium text-center text-slate-400"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://explorer.solana.com/address/${props.mint.toBase58()}?cluster=${networkConfiguration}`}
                >
                    Explorer
                </a>
            </div>
            <div className="mb-4 flex flex-row align-middle space-x-4">
                <Image
                    alt={props.name}
                    src={imagePath}
                    width="200"
                    height="200"
                />
                <p className="h-auto my-auto font-normal text-gray-700 dark:text-gray-200">
                    {props.balance}
                </p>
            </div>
            <button
                // onClick={() => borrow()}
                className="mt-4 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
                Swap
            </button>
        </div>
    )
}

export default LoanCard
