# SunGrid Protocol - Hackathon Deployment Guide 🚀

Your project is **Demo Ready**! The code builds, the copy is updated, and the disclaimer is in place.
Follow these steps to deploy everything live.

## 🛑 1. Critical: Fund Your Wallet
The deployment script failed earlier because the wallet `0xac09...` (Anvil default) has **0 ETH on Sepolia**.

1.  **Get Sepolia ETH**: Use a faucet like [Alchemy Sepolia Faucet](https://sepoliafaucet.com/) or [Infura Faucet](https://www.infura.io/faucet/sepolia).
2.  **Send Funds**: Send at least **0.05 Sepolia ETH** to the deployer address:  
    `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`  
    *(This isn't your main wallet, it's the Anvil default. For better security, update `.env` with your own private key!)*

---

## ⛓️ 2. Deploy Smart Contracts (Sepolia)
Once funded, run the deployment script I prepared:

```bash
cd packages/contracts
npm run deploy:sepolia
```

**After success**, you will see:
*   `EnergyToken` Address
*   `Marketplace` Address
*   `ChainlinkEnergyOracle` Address

---

## ⚙️ 3. Connect Frontend
Copy the **new addresses** from the previous step and update your frontend config.

1.  Open `apps/web/.env.production`.
2.  Replace the `0x000...` placeholders with your **real deployed addresses**:

```env
NEXT_PUBLIC_ENERGY_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_PRICING_ORACLE_ADDRESS=0x...
NEXT_PUBLIC_CHAINLINK_ORACLE_ADDRESS=0x...
```

*Note: Since `.env.production` might not be uploaded securely by Vercel by default, you may also need to add these as "Environment Variables" in the Vercel Dashboard project settings.*

---

## 🌍 4. Deploy Frontend (Vercel)
Finally, ship the frontend to the world.

```bash
cd apps/web
npx vercel deploy --prod
```

1.  Follow the prompts (Log in, link project).
2.  Accept default settings (the `vercel.json` I created handles the config).
3.  **Done!** You'll get a live URL (e.g., `https://sungrid-protocol.vercel.app`).

---

## 🧪 Option B: Local Demo (Backup)
If Sepolia fails or is too slow, your **Local Environment is perfectly fine for a demo!**

1.  Ensure Anvil is running: `anvil --block-time 1`
2.  Ensure Frontend is running: `npm run dev` in `apps/web`
3.  Demo at `http://localhost:3000`
4.  The "Educational Prototype" badge and "Oracle" dashboard work locally too!

**Good Luck with the Hackathon! 🏆**
