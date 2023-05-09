import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwapProgram } from "../target/types/swap_program";
import assetsConfig from "./util/assets.json";
import { initCreatePool, initFundPool } from "./instructions";

const LIQUIDITY_POOL_SEED_PREFIX = "liquidity_pool";

describe("[Running Unit Tests]: Swap Program", async () => {

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SwapProgram as anchor.Program<SwapProgram>;
  const payer = (provider.wallet as anchor.Wallet).payer

  const poolAddress = PublicKey.findProgramAddressSync(
    [Buffer.from(LIQUIDITY_POOL_SEED_PREFIX)],
    program.programId,
  )[0];

  const assets = assetsConfig.assets.map(o => { 
    return { name: o.name, quantity: o.quantity, address: new PublicKey(o.address) } 
  });

  describe("      [Unit Test]: Initialize Program", async () => {
    it("          Init Create Pool", async () => {
      await initCreatePool(program, payer, poolAddress, assets);
    });
    it("          Init Fund Pool", async () => {
      // await initFundPool(program, payer, poolAddress, assets);
    });
  });

  describe("      [Unit Test]: Swaps", async () => {});
});