# NYC Bootcamp Swap Program
Swap program for NYC Bootcamp

> 💎 Day 4 - Smuggling, Bargaining, and Upgrading Your Ship

---

In a Decentralized Exchange (DEX), a common way to manage a liquidity pool is through a Constant-Product Algorithm, which involves programmatically ensuring that the product of all assets equals some constant value `K`.  

Consider a request to swap `p` number of one asset for some unknown number of another asset `r`:
```
K = a * b * c * d * P * R
K = a * b * c * d * (P * p) * (R * r)

P * R = (P * p) * (R * r)
PR = PR + Pr + Rp + pr
0 = Pr + Rp + pr
-Rp = r(P + p)
r = [-1 * (R * p)] / (P + p)

// We know r will be negative, so
r = f(p) = (R * p) / (P + p)
```

### Spec Limitations
* This spec is assuming everything has a price of $1 per unit
* This spec has not identified a peg currency (such as $SOL, $USD, $USDC, or $GOLD)
* This spec has used some arbitrary value for `K`
* This spec has no tests