---
description: Start the entire SunGrid Protocol stack locally
---
1. Start the local blockchain node (Anvil).
2. Deploy the smart contracts to the local network.
3. Start the Next.js frontend application.

```bash
# 1. Start Anvil (run in a separate terminal or background)
anvil --block-time 1

# 2. Deploy Contracts (run in packages/contracts)
cd packages/contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast --skip-simulation

# 3. Start Frontend (run in apps/web)
cd apps/web
npm run dev
```
