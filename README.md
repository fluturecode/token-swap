# NYC Bootcamp Swap Program
Swap program for NYC Bootcamp

> 💎 Day 4 - Smuggling, Bargaining, and Upgrading Your Ship

---

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

### General Workshop Flow:
* DeFi overview
* DEX's and Constant-Product Algorithm
* SPL tokens and decimal places
* Inspect the program
    * Adding liquidity
    * Swapping
        * Emphasize on CP algorithm (nominal vs. real quantities and K)
* Build & Deploy to localnet
* Run tests
    * Inspect logs
* UI