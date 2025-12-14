# SunGrid Protocol ⚡

**Blockchain-based marketplace prototype for renewable energy credit trading.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Video Demo](https://img.shields.io/badge/Demo-Video-red)](https://youtu.be/your-video-link)
[![Live Demo](https://img.shields.io/badge/Live-App-green)](https://sungrid-protocol.vercel.app)

## 🌟 What This Is
SunGrid Protocol is a decentralized application (dApp) that demonstrates how blockchain technology can facilitate peer-to-peer (P2P) trading of renewable energy credits.
*   ✅ **Transparent Marketplace**: Buy and sell energy credits with zero intermediaries.
*   ✅ **Smart Contract Escrow**: Trustless settlement ensuring fair exchange.
*   ✅ **Real-time Price Feeds**: Integrated Chainlink Oracles for ETH/USD pricing.
*   ✅ **Solar Verification**: Simulation of IoT smart meter data integration.

## ⚠️ Prototype Disclaimer
**This project is an EDUCATIONAL PROTOTYPE built for a hackathon.**
*   ❌ **No Physical Delivery**: We trade *Energy Credits*, not physical electricity.
*   ❌ **Testnet Only**: Deployed on Sepolia/Anvil testnets. Do not use real funds.
*   ❌ **Simulation**: Energy production data is simulated for demonstration purposes.

## 🚀 Quick Start

### 1. Prerequisites
*   Node.js & npm/pnpm
*   Foundry (Forge/Anvil)
*   MetaMask (configured for Sepolia or Local Anvil)

### 2. Clone & Install
```bash
git clone https://github.com/himanshucodes101/sungrid-protocol.git
cd sungrid-protocol
npm install
```

### 3. Run Locally (Full Stack)
We use TurboRepo to run everything with one command:
```bash
npm run dev
```
This starts:
*   Local Anvil Blockchain (Port 8545)
*   Next.js Frontend (Port 3000)

### 4. Deploy Contracts (Sepolia)
*Note: Requires funded wallet*
```bash
cd packages/contracts
source .env
forge script script/Deploy.s.sol:DeployScript --rpc-url sepolia --broadcast
```

## 🛠️ Tech Stack
*   **Smart Contracts**: Solidity, Foundry
*   **Frontend**: Next.js 14, Tailwind CSS, Shadcn/UI
*   **Blockchain Integration**: Wagmi, Viem, RainbowKit
*   **Oracles**: Chainlink Data Feeds
*   **Maps**: Leaflet / React-Leaflet

## 📜 Contract Addresses (Sepolia)
*To be updated after deployment*
*   **EnergyToken**: `0x...`
*   **Marketplace**: `0x...`

## 🔮 Future Roadmap
1.  **Grid Integration**: Partner with utility providers (DISCOMs) for physical settlement.
2.  **IoT Hardware**: Custom smart meter hardware with cryptographic signatures.
3.  **Cross-Chain**: Expansion to Base/Optimism for lower fees.
4.  **DAO Governance**: Community-led parameter updates.

---
*Built with ☀️ and ☕ by the SunGrid Team*
# unstopable_lnmiit
