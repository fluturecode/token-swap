import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import { mintNewTokens } from "./util/token";

describe("[Running Setup Script]: Create Assets", () => {

  const provider = anchor.AnchorProvider.env();
  const payer = (provider.wallet as anchor.Wallet).payer
  anchor.setProvider(provider);

  /**
   * Creates an SPL token for each asset in the list of assets, with the provided configurations
   */
  it("          Creating Assets", async () => {
    let assets_conf = {
        assets: [],
    };
    // Name, decimals, quantity
    const assets: [string, number, number][] = [
        ["cannons", 3, 80],
        ["cannon_balls", 9, 60],
        ["compasses", 3, 20],
        ["fishing_nets", 3, 50],
        ["gold", 6, 500],
        ["grappling_hooks", 3, 50],
        ["gunpowder", 9, 60],
        ["muskets", 3, 60],
        ["rum", 6, 100],
        ["telescopes", 3, 20],
        ["treasure_maps", 3, 10],
    ];

    for (const a of assets) {
        const mintKeypair = Keypair.generate();
        await mintNewTokens(provider.connection, payer, mintKeypair, a);
        assets_conf.assets.push({name: a[0], decimals: a[1], quantity: a[2], address: mintKeypair.publicKey.toBase58()});
    }

    fs.writeFileSync("./tests/util/assets.json", JSON.stringify(assets_conf));
  })
});
