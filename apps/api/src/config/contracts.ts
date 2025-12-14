export const CONTRACTS = {
    EnergyToken: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    Marketplace: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    PricingOracle: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    SmartMeterRegistry: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
} as const;

// ETH to INR conversion (update this periodically)
export const ETH_TO_INR = 285000;
export const WEI_TO_INR = ETH_TO_INR / 1e18;
