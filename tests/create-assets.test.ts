import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import { mintNewTokens } from "./util/token";

describe("[Running Setup Script]: Create Assets", () => {

  const provider = anchor.AnchorProvider.env();
  const payer = (provider.wallet as anchor.Wallet).payer
  anchor.setProvider(provider);

  it("", async () => {
    let assets_conf = {
        assets: [],
    };
    const assets: [string, number][] = [
        ["cannons", 80],
        ["compasses", 20],
        ["fishing_nets", 50],
        ["gold", 500],
        ["grappling_hooks", 50],
        ["gunpowder", 60],
        ["muskets", 60],
        ["rum", 100],
        ["telescopes", 20],
        ["treasure_maps", 10],
    ];

    for (const [a, q] of assets) {
        const mintKeypair = Keypair.generate();
        await mintNewTokens(a, provider.connection, mintKeypair, payer, q);
        assets_conf.assets.push({name: a, quantity: q, address: mintKeypair.publicKey.toBase58()});
    }

    fs.writeFileSync("./tests/util/assets.json", JSON.stringify(assets_conf));
  })
});
