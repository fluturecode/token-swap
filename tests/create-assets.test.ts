import * as anchor from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import fs from 'fs'
import { mintNewTokens } from './util/token'
import { ASSETS } from './util/const'

describe('[Running Setup Script]: Create Assets', () => {
    const provider = anchor.AnchorProvider.env()
    const payer = (provider.wallet as anchor.Wallet).payer
    anchor.setProvider(provider)

    /**
     * Creates an SPL token for each asset in the list of assets, with the
     * provided configurations
     */
    it('          Creating Assets', async () => {
        let assets_conf = {
            assets: [],
        }

        for (const a of ASSETS) {
            const mintKeypair = Keypair.generate()
            await mintNewTokens(provider.connection, payer, mintKeypair, a)
            assets_conf.assets.push({
                name: a[0],
                decimals: a[1],
                quantity: a[2],
                address: mintKeypair.publicKey.toBase58(),
            })
        }

        fs.writeFileSync(
            './tests/util/assets.json',
            JSON.stringify(assets_conf)
        )
    })
})
