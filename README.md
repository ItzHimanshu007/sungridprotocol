# 🌞 SunGrid Protocol

**Decentralized Peer-to-Peer Renewable Energy Trading**

> SunGrid Protocol enables trustless, peer-to-peer renewable energy trading using blockchain-verified smart meters and real-time dynamic pricing.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/ItzHimanshu007/unstopable_lnmiit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Network](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue)](https://sepolia.etherscan.io/)

SunGrid Protocol is a next-generation decentralized application (dApp) that empowers communities to trade renewable energy directly, without centralized utilities or intermediaries.  
By leveraging Ethereum smart contracts, Chainlink oracles, and ERC-1155 energy tokens, SunGrid creates a transparent, efficient, and community-driven energy marketplace.

---

## 🚀 Live Demo

Frontend:  
https://sungrid-mz6jsm8jr-aditya-gautams-projects-496c032b.vercel.app

Network: Ethereum Sepolia Testnet  
Chain ID: 11155111

---

## ❗ Problem Statement

Traditional energy systems are centralized, opaque, and inefficient.  
Small-scale renewable producers cannot sell excess energy directly and must rely on utility companies with fixed tariffs, delayed settlements, and energy losses.

There is no transparent system to:
- Verify real energy production
- Enable local peer-to-peer energy trading
- Incentivize community-level renewable adoption

---

## 💡 Solution — SunGrid Protocol

SunGrid Protocol introduces a decentralized energy marketplace where:
- Energy is tokenized as ERC-1155 EnergyTokens
- Smart meters are verified on-chain
- Pricing is determined dynamically via Chainlink oracles
- Payments are secured using escrow-based smart contracts

This removes intermediaries and enables trustless, local energy exchange.

---

## 🔗 Why Blockchain?

Blockchain enables:
- Trustless settlement without utilities
- Tamper-proof energy records
- Transparent pricing and escrow
- Permissionless participation

Ethereum smart contracts act as neutral infrastructure ensuring fairness and automation.

---

## ✨ Key Features

- ⚡ Peer-to-Peer Marketplace  
  Buy and sell renewable energy directly using crypto.

- 🏭 Decentralized Energy Minting  
  Verified producers mint ERC-1155 EnergyTokens representing real kWh generated.

- 🔮 Dynamic Pricing Oracle  
  Real-time pricing based on supply, demand, and grid load using Chainlink.

- 📊 Interactive Analytics Dashboard  
  Track production, consumption, savings, and CO₂ offset.

- 🔐 Smart Meter Registry  
  On-chain identity verification for smart meters.

- 🌍 Environmental Impact Tracking  
  Automatic CO₂ offset and sustainability metrics.

- 🛡️ Escrow-Based Settlement  
  Funds released only after verified energy delivery.

---

## 🛠️ Technology Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Wagmi, Viem, RainbowKit
- TanStack Query + Zustand
- Recharts
- React Leaflet
- IPFS (ipfs-http-client)

---
## 🏗️ System Architecture

graph TD
    U[User / Prosumer] -->|Connect Wallet| FE[Next.js Frontend]
    FE -->|Read / Write| BC[Ethereum Smart Contracts]
    FE -->|Upload / Fetch Metadata| IPFS[IPFS Storage]

    subgraph On-Chain Layer
        BC --> ET[EnergyToken (ERC-1155)]
        BC --> MP[Energy Marketplace]
        BC --> SMR[Smart Meter Registry]
        BC --> PO[Pricing Oracle]
        PO -->|Price Feeds| CL[Chainlink Oracle]
    end

    subgraph Off-Chain Layer
        SM[Smart Meters / IoT Devices] -->|Energy Data| SMR

---

### Blockchain
- Solidity ^0.8.24
- Foundry (Forge, Cast, Anvil)
- ERC-1155 EnergyToken
- Chainlink Data Feeds
- Ethereum Sepolia Testnet

---

⚠️ Challenges & Limitations
	•	Smart meter integration requires certified IoT hardware
	•	High-frequency micro-transactions need Layer-2 scaling
	•	Energy trading regulations vary by region
	•	Oracle accuracy depends on off-chain data reliability

----

🛣️ Roadmap

Phase 1 (Current)
	•	P2P energy marketplace
	•	ERC-1155 energy tokens
	•	Chainlink pricing oracle

Phase 2
	•	Layer-2 deployment (Polygon / Arbitrum)
	•	IoT smart meter integration
	•	DAO-based governance

Phase 3
	•	Carbon credit NFTs
	•	Smart city & microgrid partnerships
	•	Cross-region energy pools

⸻

🔐 Security & Assumptions
	•	Solidity ^0.8.x overflow protection
	•	Escrow-based buyer protection
	•	Verified smart meter registry
	•	Decentralized oracle assumptions

⸻

💻 Local Development Setup

Prerequisites
	•	Node.js 18+
	•	Foundry
	•	Git

---

Start Local Blockchain
anvil --block-time 1

---

Deploy Contracts
cd packages/contracts
forge build
./deploy-local.sh

---

Run Frontend
cd packages/contracts
forge build

---

Open http://localhost:3000

---

🤝 Contributing
	1.	Fork the repository
	2.	Create a feature branch
	3.	Commit your changes
	4.	Open a Pull Request

---

📄 License

Licensed under the MIT License.

---
