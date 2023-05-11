# NYC Bootcamp Swap Program
Swap program for NYC Bootcamp

> 💎 Day 4 - Smuggling, Bargaining, and Upgrading Your Ship

---

### [<img src="https://raw.githubusercontent.com/solana-developers/pirate-bootcamp/main/docs/images/slides-icon.svg" alt="slides" width="20" align="center"/> Presentation Slides](https://docs.google.com/presentation/d/1E15mIvnMg9qvR9RPJnIC9Y4cod-QjBJpjPZ4rQpgEIE/edit?usp=sharing)

In a Decentralized Exchange (DEX), a common way to manage a liquidity pool is through a Constant-Product Algorithm, which involves programmatically ensuring that the product of all assets equals some constant value `K`.  

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

### Roadmap
Here's what we want to lay down for Day 4:
* Asset metadata
    * We can optionally modify the tests to include the creation of metadata accounts for the corresponding URIs provided in `ASSETS` - ideally in `create-assets.test.ts`
    * We also want to create a collection on devnet, clone it down to localnet, and make sure these tokens are part of that collection
    * 💡 Perhaps we can use this in the Day 5 with Amman as an extra value-add?
* Liquidity Pool UI
    * Want to build a cool UI for interacting with the liquidity pool via connected wallet
        * You should be able to see the assets you hold in your connected wallet
        * You should be able to get a preview of what the swap is going to be (amount to recieve)
    * We'll need to make sure we place the code from `tests` - such as the instructions for the program and the token account lookups - in a spot where the code can easily be shared by tests and the UI
    * We'll also want to add some code to "preview swap" so we can use it on the front end, and integrate it into the tests as validation
        * This code should include checks the program will enforce, such as:
            * Amount can't be 0
            * Mints can't match
            * Can't overflow liquidity
            * etc.
* Re-work Day 4 activity flow
    * We're going to have people just interact with the pool instead of trying to write their own
    * Should we just have people use the UI or give them a challenge to write a script to hit the pool?
* ✅ Build presentation for workshop

And here's what we want to lay down for Day 5:
* What tools are we going to use to enhance the swap program?
    * Amman ?
    * Lookup Tables ?
    * Geyser ?
    * any ideas ?
* What other stuff can we add to spice things up?
    * Arbitrage ?
    * Enhanced AMM algorithm ?
* How to re-use much of the Day 4 stuff without copy-pasting (if possible)?
* General workshop flow for Day 5
* Update Day 5 gameplan in Notion accordingly

### General Workshop Flow:
* ✅ Presentation Slides
    * ✅ DeFi overview
    * ✅ DEX's and Constant-Product Algorithm
    * ✅ SPL tokens and decimal places
* ✅ Inspect the program
    * ✅ Adding liquidity
    * ✅ Swapping
        * ✅ Emphasize on CP algorithm (nominal vs. real quantities and K)
* ✅ Build & Deploy to localnet
* ✅ Run tests
    * Inspect logs
* ⚡️ UI