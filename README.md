# 🌞 SunGrid Protocol

**Decentralized Peer-to-Peer Energy Trading Platform**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/ItzHimanshu007/unstopable_lnmiit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deployed on Sepolia](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue)](https://sepolia.etherscan.io/)

SunGrid Protocol is a next-generation decentralized application (dApp) that empowers communities to trade renewable energy directly. By leveraging Ethereum smart contracts, it eliminates middlemen, allowing solar energy producers to sell excess power to neighbors securely, transparently, and efficiently.

---

## 🚀 Live Demo

**Frontend Application:** [https://sungrid-mz6jsm8jr-aditya-gautams-projects-496c032b.vercel.app](https://sungrid-mz6jsm8jr-aditya-gautams-projects-496c032b.vercel.app)

**Network:** Ethereum Sepolia Testnet  
**Chain ID:** 11155111

---

## ✨ Key Features

*   **⚡ Peer-to-Peer Marketplace**: Buy and sell energy directly using crypto. No utility company markups.
*   **🏭 Decentralized Minting**: Verified producers can mint `EnergyTokens` (ERC-1155) representing real kWh generated.
*   **🔮 Dynamic Pricing Oracle**: Real-time energy pricing based on supply, demand, and grid load, integrated with **Chainlink** price feeds.
*   **📊 Interactive Dashboard**: track consumption, production, and cost savings with beautiful visualizations (Recharts).
*   **🔐 Smart Meter Registry**: On-chain identity verification for smart meters ensures only real energy is traded.
*   **🌍 Impact Tracking**: Real-time calculation of CO₂ offset and environmental contributions.
*   **🛡️ Escrow Settlement**: Smart contracts hold funds securely until energy delivery is verified.

---

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `shadcn/ui`
*   **Web3 Integration**: [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/)
*   **State Management**: [TanStack Query](https://tanstack.com/query) + Zustand
*   **Maps**: React Leaflet
*   **Storage**: IPFS (via `ipfs-http-client`)

### Blockchain
*   **Language**: Solidity (v0.8.24)
*   **Framework**: [Foundry](https://getfoundry.sh/) (Forge, Cast, Anvil)
*   **Tokens**: ERC-1155 (EnergyToken)
*   **Oracles**: Chainlink Data Feeds
*   **Deployment**: Sepolia Testnet

---

## 🏗️ Architecture

```mermaid
graph TD
    User[User] --> |Connects Wallet| UI[Next.js Frontend]
    UI --> |Reads/Writes| Contract[Smart Contracts]
    UI --> |Uploads Meta| IPFS[IPFS Storage]
    
    subgraph "On-Chain Layer"
        Contract --> EnergyToken[EnergyToken (ERC1155)]
        Contract --> Marketplace[Marketplace Logic]
        Contract --> Registry[SmartMeter Registry]
        Contract --> Oracle[Pricing Oracle]
    end
    
    subgraph "External"
        Oracle --> |Feeds| Chainlink[Chainlink Aggregators]
    end
```

---

## 📜 Deployed Contracts (Sepolia)

| Contract | Address |
|----------|---------|
| **EnergyToken** | `0x789511BC40FD93DC407a1BFF8C61daC8639B05e9` |
| **Marketplace** | `0xe89362A753022081754eD93C6AB4E1a38b32456B` |
| **PricingOracle** | `0x15E60A05947EB7DF040B36e57d3746815233Be03` |
| **SmartMeterRegistry** | `0x834D77181C018849f53b2e7c7656cBcb260670bA` |
| **ChainlinkEnergyOracle** | `0x08B65BFf8342BA5a1cDC0Cb28003a8e940B88884` |

---

## 💻 Local Development Setup

Follow these steps to run the full stack locally.

### Prerequisites
*   Node.js 18+
*   Foundry (Forge, Anvil)
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/ItzHimanshu007/unstopable_lnmiit.git
cd sungrid-protocol
```

### 2. Start Local Blockchain
Start a local Ethereum node using Anvil.
```bash
anvil --block-time 1
```

### 3. Deploy Contracts
In a new terminal, deploy the smart contracts to your local node.
```bash
cd packages/contracts
forge build
./deploy-local.sh 
# Or: forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
```

### 4. Configure Frontend
Navigate to the web app and set up your environment variables.
```bash
cd apps/web
npm install
```
Create a `.env.local` file with your local contract addresses (automatically logged during deployment).

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
