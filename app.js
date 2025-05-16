// Contract ABIs
const swapPlatformABI = [
    "function swap(uint256 usdtAmount, address referrer) external",
    "function claimReferralIncome() external",
    "function getReferralRewards(address user) external view returns (uint256[6])",
    "function hasSwapped(address user) external view returns (bool)",
    "function isRegistered(address user) external view returns (bool)",
    "function referrers(address user) external view returns (address)",
    "function owner() external view returns (address)",
    "function myToken() external view returns (address)",
    "function usdt() external view returns (address)",
    "event Swap(address indexed user, uint256 usdtAmount, uint256 tokenAmount, address indexed referrer)",
    "event ReferralReward(address indexed user, address indexed referrer, uint256 amount, uint256 level)",
    "event RewardClaimed(address indexed user, uint256 amount)"
];

const erc20ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
    "function totalSupply() external view returns (uint256)",
    "function name() external view returns (string memory)",
    "function symbol() external view returns (string memory)",
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Contract addresses
const MYTOKEN_ADDRESS = "0x603bd32320f7b32d9cb898e77f787a9af9e46bc4"; // MyToken address
const USDT_ADDRESS = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"; // BEP-20 USDT address on BSC Testnet
const SWAP_PLATFORM_ADDRESS = "0x8b2ac05c9cd0a870b21bdd4d0beac88f065e0e0c"; // SwapPlatform address

let provider;
let signer;
let swapPlatform;
let usdtContract;
let myTokenContract;
let userAddress;
let userReferrer = null;

// DOM Elements
const connectWalletBtn = document.getElementById('connectWallet');
const swapButton = document.getElementById('swapButton');
const claimRewardsBtn = document.getElementById('claimRewards');
const usdtAmountInput = document.getElementById('usdtAmount');
const referrerAddressInput = document.getElementById('referrerAddress');
const estimatedTokensDiv = document.getElementById('estimatedTokens');
const referralLinkInput = document.getElementById('referralLink');
const copyLinkBtn = document.getElementById('copyLink');
const level1RewardsSpan = document.getElementById('level1Rewards');
const level2RewardsSpan = document.getElementById('level2Rewards');
const level3to6RewardsSpan = document.getElementById('level3to6Rewards');
const totalRewardsSpan = document.getElementById('totalRewards');

// Initialize Web3
async function init() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            
            // Initialize contracts
            swapPlatform = new ethers.Contract(SWAP_PLATFORM_ADDRESS, swapPlatformABI, signer);
            usdtContract = new ethers.Contract(USDT_ADDRESS, erc20ABI, signer);
            myTokenContract = new ethers.Contract(MYTOKEN_ADDRESS, erc20ABI, signer);
            
            // Check if user is registered and get their referrer
            await checkUserRegistration();
            
            // Update UI
            connectWalletBtn.textContent = userAddress.slice(0, 6) + '...' + userAddress.slice(-4);
            updateReferralLink();
            updateRewards();
            
            // Enable buttons
            swapButton.disabled = false;
            claimRewardsBtn.disabled = false;
            
            // Add event listeners
            usdtAmountInput.addEventListener('input', updateEstimatedTokens);
            swapButton.addEventListener('click', executeSwap);
            claimRewardsBtn.addEventListener('click', claimRewards);
            copyLinkBtn.addEventListener('click', copyReferralLink);
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            
        } catch (error) {
            console.error('Error initializing Web3:', error);
            alert('Error connecting to wallet. Please try again.');
        }
    } else {
        alert('Please install MetaMask to use this application.');
    }
}

// Check if user is registered and get their referrer
async function checkUserRegistration() {
    try {
        const isUserRegistered = await swapPlatform.isRegistered(userAddress);
        if (isUserRegistered) {
            userReferrer = await swapPlatform.referrers(userAddress);
            referrerAddressInput.value = userReferrer;
            referrerAddressInput.disabled = true;
            referrerAddressInput.placeholder = "Referrer address is locked";
        } else {
            referrerAddressInput.disabled = false;
            referrerAddressInput.placeholder = "Enter referrer address (optional)";
        }
    } catch (error) {
        console.error('Error checking user registration:', error);
    }
}

// Handle account changes
async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        // User disconnected
        location.reload();
    } else {
        userAddress = accounts[0];
        signer = provider.getSigner();
        await checkUserRegistration();
        updateReferralLink();
        updateRewards();
    }
}

// Update estimated tokens based on input
async function updateEstimatedTokens() {
    const amount = usdtAmountInput.value;
    if (amount > 0) {
        try {
            if (amount < 1) {
                estimatedTokensDiv.textContent = 'Minimum swap amount is 1 USDT';
                swapButton.disabled = true;
                return;
            }
            
            const hasSwappedBefore = await swapPlatform.hasSwapped(userAddress);
            const multiplier = hasSwappedBefore ? 1 : 1.2; // 20% bonus for first swap
            const estimatedAmount = amount * multiplier;
            estimatedTokensDiv.textContent = `${estimatedAmount} MyToken`;
            swapButton.disabled = false;
        } catch (error) {
            console.error('Error calculating estimated tokens:', error);
            estimatedTokensDiv.textContent = 'Error calculating tokens';
            swapButton.disabled = true;
        }
    } else {
        estimatedTokensDiv.textContent = '0 MyToken';
        swapButton.disabled = true;
    }
}

// Execute swap
async function executeSwap() {
    try {
        const amount = usdtAmountInput.value;
        const referrer = referrerAddressInput.value;
        
        if (!amount || amount < 1) {
            alert('Minimum swap amount is 1 USDT');
            return;
        }
        
        // Validate referrer address if provided
        if (referrer && !userReferrer) {
            if (!ethers.utils.isAddress(referrer)) {
                alert('Invalid referrer address');
                return;
            }
            if (referrer.toLowerCase() === userAddress.toLowerCase()) {
                alert('Cannot refer yourself');
                return;
            }
        }

        console.log('Starting swap process...');
        console.log('Amount:', amount);
        console.log('Referrer:', referrer || 'No referrer');
        
        // Convert amount to wei
        const decimals = await usdtContract.decimals();
        console.log('USDT decimals:', decimals);
        const amountWei = ethers.utils.parseUnits(amount.toString(), decimals);
        console.log('Amount in wei:', amountWei.toString());
        
        // Check USDT balance
        const balance = await usdtContract.balanceOf(userAddress);
        console.log('USDT balance:', ethers.utils.formatUnits(balance, decimals));
        if (balance.lt(amountWei)) {
            alert('Insufficient USDT balance');
            return;
        }
        
        // Check and set allowance
        const allowance = await usdtContract.allowance(userAddress, SWAP_PLATFORM_ADDRESS);
        console.log('Current allowance:', ethers.utils.formatUnits(allowance, decimals));
        
        if (allowance.lt(amountWei)) {
            console.log('Approving USDT...');
            const approveTx = await usdtContract.approve(SWAP_PLATFORM_ADDRESS, ethers.constants.MaxUint256);
            console.log('Approval transaction:', approveTx.hash);
            await approveTx.wait();
            console.log('Approval confirmed');
        }
        
        // Execute swap
        console.log('Executing swap...');
        const swapTx = await swapPlatform.swap(amountWei, referrer || ethers.constants.AddressZero);
        console.log('Swap transaction:', swapTx.hash);
        await swapTx.wait();
        console.log('Swap confirmed');
        
        // Update UI
        await checkUserRegistration(); // Check if user is now registered
        updateRewards();
        usdtAmountInput.value = '';
        estimatedTokensDiv.textContent = '0 MyToken';
        
        alert('Swap executed successfully!');
    } catch (error) {
        console.error('Error executing swap:', error);
        if (error.message.includes('Minimum swap amount')) {
            alert('Minimum swap amount is 1 USDT');
        } else if (error.message.includes('Circular referral')) {
            alert('Circular referral detected');
        } else if (error.message.includes('insufficient funds')) {
            alert('Insufficient funds for gas * price + value');
        } else if (error.message.includes('user rejected')) {
            alert('Transaction was rejected by user');
        } else {
            alert('Error executing swap: ' + error.message);
        }
    }
}

// Claim referral rewards
async function claimRewards() {
    try {
        const tx = await swapPlatform.claimReferralIncome();
        await tx.wait();
        updateRewards();
        alert('Rewards claimed successfully!');
    } catch (error) {
        console.error('Error claiming rewards:', error);
        alert('Error claiming rewards. Please try again.');
    }
}

// Update referral rewards display
async function updateRewards() {
    try {
        const rewards = await swapPlatform.getReferralRewards(userAddress);
        const level1 = ethers.utils.formatUnits(rewards[0], 18);
        const level2 = ethers.utils.formatUnits(rewards[1], 18);
        const level3to6 = rewards.slice(2).reduce((acc, val) => acc.add(val), ethers.BigNumber.from(0));
        const total = rewards.reduce((acc, val) => acc.add(val), ethers.BigNumber.from(0));
        
        level1RewardsSpan.textContent = `${level1} USDT`;
        level2RewardsSpan.textContent = `${level2} USDT`;
        level3to6RewardsSpan.textContent = `${ethers.utils.formatUnits(level3to6, 18)} USDT`;
        totalRewardsSpan.textContent = `${ethers.utils.formatUnits(total, 18)} USDT`;
        
        // Enable/disable claim button
        claimRewardsBtn.disabled = total.isZero();
    } catch (error) {
        console.error('Error updating rewards:', error);
    }
}

// Update referral link
function updateReferralLink() {
    const baseUrl = window.location.origin + window.location.pathname;
    referralLinkInput.value = `${baseUrl}?ref=${userAddress}`;
}

// Copy referral link
function copyReferralLink() {
    referralLinkInput.select();
    document.execCommand('copy');
    alert('Referral link copied to clipboard!');
}

// Initialize on page load
window.addEventListener('load', init); 