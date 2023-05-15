# 💎 Quest 4 - Smuggling, Bargaining, and Upgrading Your Ship

📘 We saw how you can “tokenize” assets using NFTs & tokens, and trade them for Gold.

Now let’s see how we can expand on those concepts to trade (or swap) assets, scale prices based on supply, and create markets for assets!

We’ll explore the fundamental concepts behind a Decentralized Exchange (DEX) as we effectively create an automated market maker.

Build your trading center and see if you can get other pirates to do business in your neck of the woods!

---

### [<img src="https://raw.githubusercontent.com/solana-developers/pirate-bootcamp/main/docs/images/slides-icon.svg" alt="slides" width="20" align="center"/> Presentation Slides](https://docs.google.com/presentation/d/1E15mIvnMg9qvR9RPJnIC9Y4cod-QjBJpjPZ4rQpgEIE/edit?usp=sharing)

### DEXs

Decentralized Exchanges (DEXs) make use of what's called a "Liquidity Pool". This is simply a pool of assets (usually tokens) that are provided by investors (called "Liquidity Providers") and can be exchanged on the platform in a permissionless, peer-to-peer manner.

A common way DEXs manage a liquidity pool is through a **Constant-Product Algorithm**, which involves programmatically ensuring that the product of all assets equals some constant value `K`.

Consider a request to swap `p` number of one asset for some unknown number of another asset `r`:

```
K = a * b * c * d * P * R
K = a * b * c * d * (P + p) * (R - r)

a * b * c * d * P * R = a * b * c * d * (P + p) * (R - r)
PR = (P + p) * (R - r)
PR = PR - Pr + Rp - pr
0 = 0 - Pr + Rp - pr
-Rp = -Pr - pr
-Rp = r(-P - p)
r = (-Rp) / (-P - p)
r = [-1 * Rp] / [-1 * (P + p)]
r = Rp / (P + p)

r = f(p) = (R * p) / (P + p)
```

### About this Repository

This repository is broken up as follows:

-   `app`: The User Interface for interacting with a deployed swap program
-   `programs/swap_program`: The swap program itself
-   `tests`: A series of tests to run on the swap program

If you're following this workshop **on your own**:

1. Run `upload-json.test.ts` to upload the images to Arweave's devnet, where they will be available to create token metadata
2. Run `create-assets.test.ts` to create SPL tokens for each asset and mint them to your local keypair
3. Run `main.test.ts` to test the swap program:
    - First this test will fund the Liquidity Pool from your local keypair's minted assets
    - Then it will attempt to load the Liquidity Pool's holdings
    - Lastly, it will run several test swaps on the pool using your local keypair
        - Note: These tests will first mint new assets to your local keypair to swap with

If you're following this workshop **in an existing bootcamp**:

1. You will have to request assets be airdropped to your wallet from a bootcamp administrator
    - This is for testing the swap program and for funding your swap program's Liquidity Pool after deployment
    - The mint addresses of each asset are fixed for the bootcamp, so creating your own with `create-assets.test.ts` will create new assets only compatible with your swap program and not with the rest of the bootcamp
2. Deploy your swap program
3. Request your swap program be funded
4. You will start with only Gold as an asset, and you can begin swapping for other assets once the pool is funded

---

### To Build:

-   Liquidity Pool UI
    -   Want to build a cool UI for interacting with the liquidity pool via connected wallet
        -   You should be able to see the assets you hold in your connected wallet
        -   You should be able to get a preview of what the swap is going to be (amount to recieve)
    -   We'll also want to add some code to "preview swap" so we can use it on the front end, and integrate it into the tests as validation
        -   This code should include checks the program will enforce, such as:
            -   Amount can't be 0
            -   Mints can't match
            -   Can't overflow liquidity
            -   etc.
    -   Most importantly, the UI should be able to load any swap program via Program ID or IDL, so when users deploy their own swap program, they can use the same UI to interact with it
