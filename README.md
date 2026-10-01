# Decentralized Swap Platform

A fully decentralized swapping platform on the BNB Chain (BEP-20) with an incentivized referral system and first-time swap bonus.

## Table of Contents
- [Features](#features)
- [Smart Contracts](#smart-contracts)
- [Technical Architecture](#technical-architecture)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [Security](#security)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

- **Token Swapping**
  - Swap USDT (BEP-20) to MyToken (BEP-20)
  - Real-time price calculations
  - Slippage protection
  - Transaction confirmation tracking

- **Referral System**
  - Multi-level referral system (up to 6 levels)
  - Real-time reward tracking
  - Referral link generation
  - Reward claiming mechanism

- **User Benefits**
  - First-time swap bonus (20% extra tokens)
  - Transparent reward distribution
  - Historical transaction tracking
  - Referral statistics dashboard

- **Platform Features**
  - Modern and responsive UI
  - MetaMask integration
  - Real-time transaction status
  - Gas optimization

## Smart Contracts

The platform consists of two main smart contracts:

1. `MyToken.sol`: A standard BEP-20 token contract
   - Standard ERC20 functionality
   - Minting capabilities
   - Burn mechanism
   - Transfer restrictions

2. `SwapPlatform.sol`: The main swapping platform contract
   - Swap functionality
   - Referral system implementation
   - Reward distribution
   - Emergency controls

### Contract Features

- **Swap Mechanism**
  - First-time swap bonus (1.2x tokens)
  - Slippage protection
  - Minimum swap amount
  - Maximum swap amount

- **Referral System**
  - 6-level referral structure:
    - Level 1 (Direct): 4%
    - Level 2: 2%
    - Levels 3-6: 1% each
  - Anti-abuse measures:
    - Double swap bonus prevention
    - Self-referral prevention
    - Circular referral prevention
  - Transparent on-chain record of swaps and rewards

## Technical Architecture

- **Frontend**
  - React.js
  - Web3.js for blockchain interaction
  - MetaMask integration
  - Responsive design

- **Backend**
  - Smart contracts on BSC
  - Event listeners
  - Transaction monitoring
  - Gas optimization

## Setup Instructions

1. **Prerequisites**
   ```bash
   Node.js v14+
   npm or yarn
   MetaMask wallet
   BSC network configuration
   ```

2. **Installation**
   ```bash
   # Clone the repository
   git clone [repository-url]
   cd decentralized-swap-platform

   # Install dependencies
   npm install
   ```

3. **Configuration**
   - Create `.env` file with required variables:
     ```
     PRIVATE_KEY=your_private_key
     BSC_RPC_URL=your_bsc_rpc_url
     ```

4. **Contract Deployment**
   ```bash
   # Deploy to BSC mainnet
   npx hardhat run scripts/deploy.js --network bsc

   # Deploy to BSC testnet
   npx hardhat run scripts/deploy.js --network bscTestnet
   ```

5. **Frontend Setup**
   - Update contract addresses in `app.js`:
     ```javascript
     const USDT_ADDRESS = "0x..."; // BEP-20 USDT address
     const MYTOKEN_ADDRESS = "0x..."; // MyToken address
     const SWAP_PLATFORM_ADDRESS = "0x..."; // SwapPlatform address
     ```

## Usage Guide

1. **Wallet Connection**
   - Install MetaMask
   - Connect to BSC network
   - Connect wallet to platform

2. **Token Swapping**
   - Enter swap amount
   - Review transaction details
   - Confirm transaction
   - Track transaction status

3. **Referral System**
   - Generate referral link
   - Share with potential users
   - Track referral rewards
   - Claim rewards

## Security

- **Smart Contract Security**
  - OpenZeppelin contracts integration
  - ReentrancyGuard implementation
  - Access control mechanisms
  - Emergency pause functionality

- **Platform Security**
  - HTTPS enforcement
  - Input validation
  - Rate limiting
  - Error handling

## Development

### Local Development

1. **Start Local Network**
   ```bash
   npx hardhat node
   ```

2. **Deploy Contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Run Tests**
   ```bash
   npx hardhat test
   ```

## Testing

- Unit tests for smart contracts
- Integration tests
- Frontend component tests
- End-to-end testing

## Deployment

- Smart contract deployment scripts
- Frontend deployment guide
- Environment configuration
- Network-specific settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

- GitHub Issues
- Documentation
- Community Discord
- Email Support

<!-- readme-seo: bannysukumar -->

## Open source

This repository is open source and maintained by [Banny Sukumar](https://github.com/Bannysukumar). Decentralized Swaping With Refferal is published so other developers can study the code and contribute.

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Banny Sukumar. See [CONTRIBUTING.md](CONTRIBUTING.md) if you want to help.
