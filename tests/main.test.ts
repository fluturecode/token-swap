import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwapProgram } from "../target/types/swap_program";
import assetsConfig from "./util/assets.json";
import { createPool, fundPool, swap } from "./instructions";
import { calculateChangeInK, calculateK, fetchPool, fetchPoolTokenAccounts } from "./util/swap";
import { logChangeInK, logK, logPool, logTokenBalance } from "./util/log";
import { mintExistingTokens } from "./util/token";

const LIQUIDITY_POOL_SEED_PREFIX = "liquidity_pool";

const sleepSeconds = async (s: number) => await new Promise(f => setTimeout(f, s * 1000))

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
    return { name: o.name, quantity: o.quantity, decimals: o.decimals, address: new PublicKey(o.address) } 
  });

  let programInitialized = false;

  before("          Check if Pool exists", async () => {
    let poolAccountInfo = await provider.connection.getAccountInfo(poolAddress);
    if (poolAccountInfo != undefined && poolAccountInfo.lamports != 0) {
      console.log("   Pool already initialized!");
      console.log(`     Address: ${poolAddress.toBase58()}`);
      programInitialized = true;
    }
  })

  it("          Init Create Pool", async () => {
    if (!programInitialized) {
      await createPool(program, payer, poolAddress);
    }
  });

  for (const asset of assets) {
    it(`          Fund Pool with: ${asset.name}`, async () => {
      if (!programInitialized) {
        await fundPool(program, payer, poolAddress, asset.address, asset.quantity, asset.decimals);
      }
    });
  }

  async function getPoolData(printOnlyK: boolean): Promise<bigint> {
    const pool = await fetchPool(program, poolAddress);
    const poolTokenAccounts = await fetchPoolTokenAccounts(provider.connection, poolAddress, pool);
    const k = calculateK(poolTokenAccounts);
    if (printOnlyK) {
      logK(k);
    } else {
      logPool(poolAddress, pool, poolTokenAccounts, k);
    }
    return k;
  }

  it("          Get Liquidity Pool Data", async () => await getPoolData(false));

  async function trySwap(
    receive: {name: string, quantity: number, decimals: number, address: PublicKey}, 
    pay: {name: string, quantity: number, decimals: number, address: PublicKey}, 
    payAmount: number,
  ) {
    await mintExistingTokens(provider.connection, pay.address, payer, payAmount, pay.decimals);
    await sleepSeconds(3);
    const initialK = await getPoolData(true);
    await logTokenBalance(
      provider.connection, 
      receive.address, 
      payer.publicKey, 
      "Before Swap: Asset Requested to Receive: " + receive.name,
    );
    await logTokenBalance(
      provider.connection, 
      pay.address, 
      payer.publicKey, 
      "Before Swap: Asset Offered to Pay: " + pay.name,
    );
    await swap(program, payer, poolAddress, receive.address, pay.address, payAmount, pay.decimals);
    await sleepSeconds(3);
    await logTokenBalance(
      provider.connection, 
      receive.address, 
      payer.publicKey, 
      "After Swap: Asset Requested to Receive: " + receive.name,
    );
    await logTokenBalance(
      provider.connection, 
      pay.address, 
      payer.publicKey, 
      "After Swap: Asset Offered to Pay: " + pay.name,
    );
    const resultingK = await getPoolData(true);
    const changeInK = resultingK - initialK;
    logChangeInK(calculateChangeInK(initialK, resultingK));
  }

  it("          Try Swap", async () => await trySwap(assets[0], assets[1], 5));
  it("          Try Swap", async () => await trySwap(assets[1], assets[2], 1));
  it("          Try Swap", async () => await trySwap(assets[0], assets[2], 3));
  it("          Try Swap", async () => await trySwap(assets[6], assets[7], 15));
  it("          Try Swap", async () => await trySwap(assets[4], assets[7], 15));
  it("          Try Swap", async () => await trySwap(assets[1], assets[7], 5));
  it("          Try Swap", async () => await trySwap(assets[5], assets[9], 5));
});