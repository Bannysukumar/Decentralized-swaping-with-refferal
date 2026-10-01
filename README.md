# Decentralized Swap Platform

A fully decentralized swapping platform on the BNB Chain (BEP-20) with an incentivized referral system and first-time swap bonus.

[![License](https://img.shields.io/github/license/Bannysukumar/Decentralized-swaping-with-refferal)](https://github.com/Bannysukumar/Decentralized-swaping-with-refferal/blob/main/LICENSE) [![Stars](https://img.shields.io/github/stars/Bannysukumar/Decentralized-swaping-with-refferal)](https://github.com/Bannysukumar/Decentralized-swaping-with-refferal/stargazers) [![Last commit](https://img.shields.io/github/last-commit/Bannysukumar/Decentralized-swaping-with-refferal)](https://github.com/Bannysukumar/Decentralized-swaping-with-refferal/commits/main)

## Overview

A fully decentralized swapping platform on the BNB Chain (BEP-20) with an incentivized referral system and first-time swap bonus.


What is actually in the repository: `contracts/MyToken.sol`, `contracts/SwapPlatform.sol`, `contracts/`. GitHub reports the primary language as HTML.

Published site recorded on the repository: https://decentralized-swaping-with-refferal.vercel.app

## Features


- Token Swapping
- Referral System
- User Benefits
- Platform Features
- MyToken contract with mint
- SwapPlatform Solidity contract

## Tech Stack

| Technology | Where it shows up |
|---|---|
| Solidity | Smart contracts |
| Hardhat | Solidity compile and deploy scripts |
| ethers.js or web3.js | Wallet and contract calls from the browser or app |
| OpenZeppelin | Smart-contract base contracts |

## Project Architecture

Browser page → Solidity contract. The HTML references MetaMask.

## Project Structure

```text
Decentralized-swaping-with-refferal/
├── contracts/
├── app.js
├── hardhat.config.js
├── index.html
├── package.json
├── styles.css
```

## Getting Started

```bash
git clone https://github.com/Bannysukumar/Decentralized-swaping-with-refferal.git
cd Decentralized-swaping-with-refferal
npm install
npm run compile
```

Scripts defined in package.json:

- `npm run test` — `npx hardhat test`
- `npm run compile` — `npx hardhat compile`
- `npm run deploy` — `npx hardhat run scripts/deploy.js --network bsc`
- `npm run deploy:testnet` — `npx hardhat run scripts/deploy.js --network bscTestnet`

## Deployment

- The repository homepage is https://decentralized-swaping-with-refferal.vercel.app.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Licensed under MIT. See [LICENSE](LICENSE).

## Author

[Banny Sukumar](https://github.com/Bannysukumar)

- GitHub: [@Bannysukumar](https://github.com/Bannysukumar)
- Portfolio: [adepu-sukumar.vercel.app](https://adepu-sukumar.vercel.app/)
- LinkedIn: [Adepu Sukumar](https://www.linkedin.com/in/adepu-sukumar-59b423351)
