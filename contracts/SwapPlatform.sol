// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SwapPlatform is Ownable, ReentrancyGuard {
    IERC20 public usdtToken;
    IERC20 public myToken;
    
    // Constants for referral levels
    uint256 public constant LEVEL1_PERCENTAGE = 400; // 4%
    uint256 public constant LEVEL2_PERCENTAGE = 200; // 2%
    uint256 public constant LEVEL3_6_PERCENTAGE = 100; // 1%
    uint256 public constant BONUS_PERCENTAGE = 1200; // 120% (20% bonus)
    uint256 public constant BASIS_POINTS = 10000; // 100%
    uint256 public constant MIN_SWAP_AMOUNT = 1 * 10**18; // 1 USDT (assuming 18 decimals)
    
    // Mapping to track first-time swappers
    mapping(address => bool) public hasSwapped;
    
    // Referral system mappings
    mapping(address => address) public referrers;
    mapping(address => mapping(uint256 => uint256)) public referralRewards; // user => level => amount
    mapping(address => bool) public isRegistered;
    
    // Events
    event SwapExecuted(address indexed user, uint256 usdtAmount, uint256 myTokenAmount, bool isFirstSwap);
    event ReferralRegistered(address indexed user, address indexed referrer);
    event RewardsClaimed(address indexed user, uint256 amount);
    event TokensDeposited(address indexed token, uint256 amount);
    event TokensWithdrawn(address indexed token, uint256 amount);
    event ReferralRewardsDistributed(address indexed user, address indexed referrer, uint256 amount, uint256 level);
    
    constructor(address _usdtToken, address _myToken) Ownable(msg.sender) {
        usdtToken = IERC20(_usdtToken);
        myToken = IERC20(_myToken);
    }
    
    function swap(uint256 usdtAmount, address referrer) external nonReentrant {
        require(usdtAmount >= MIN_SWAP_AMOUNT, "Minimum swap amount is 1 USDT");
        require(usdtToken.transferFrom(msg.sender, address(this), usdtAmount), "USDT transfer failed");
        
        uint256 myTokenAmount;
        bool isFirstSwap = !hasSwapped[msg.sender];
        
        if (isFirstSwap) {
            // Apply 20% bonus for first-time swappers
            myTokenAmount = (usdtAmount * BONUS_PERCENTAGE) / BASIS_POINTS;
            hasSwapped[msg.sender] = true;
            
            // Handle referrer registration only for first swap
            if (!isRegistered[msg.sender]) {
                if (referrer != address(0) && referrer != msg.sender) {
                    require(!isCircularReferral(msg.sender, referrer), "Circular referral detected");
                    referrers[msg.sender] = referrer;
                    isRegistered[msg.sender] = true;
                    emit ReferralRegistered(msg.sender, referrer);
                    
                    // Distribute referral rewards only for new users
                    distributeReferralRewards(msg.sender, usdtAmount);
                }
            } else {
                // If user is already registered, use their existing referrer
                if (referrers[msg.sender] != address(0)) {
                    distributeReferralRewards(msg.sender, usdtAmount);
                }
            }
        } else {
            myTokenAmount = usdtAmount; // 1:1 ratio for non-first swaps
        }
        
        require(myToken.transfer(msg.sender, myTokenAmount), "MyToken transfer failed");
        emit SwapExecuted(msg.sender, usdtAmount, myTokenAmount, isFirstSwap);
    }
    
    function distributeReferralRewards(address user, uint256 amount) internal {
        address currentReferrer = referrers[user];
        uint256 level = 1;
        
        while (currentReferrer != address(0) && level <= 6) {
            uint256 rewardPercentage;
            if (level == 1) {
                rewardPercentage = LEVEL1_PERCENTAGE;
            } else if (level == 2) {
                rewardPercentage = LEVEL2_PERCENTAGE;
            } else {
                rewardPercentage = LEVEL3_6_PERCENTAGE;
            }
            
            uint256 reward = (amount * rewardPercentage) / BASIS_POINTS;
            referralRewards[currentReferrer][level] += reward;
            
            emit ReferralRewardsDistributed(user, currentReferrer, reward, level);
            
            currentReferrer = referrers[currentReferrer];
            level++;
        }
    }
    
    function isCircularReferral(address user, address referrer) public view returns (bool) {
        address currentReferrer = referrer;
        while (currentReferrer != address(0)) {
            if (currentReferrer == user) {
                return true;
            }
            currentReferrer = referrers[currentReferrer];
        }
        return false;
    }
    
    function claimReferralIncome() external nonReentrant {
        uint256 totalRewards = 0;
        
        for (uint256 level = 1; level <= 6; level++) {
            uint256 levelRewards = referralRewards[msg.sender][level];
            if (levelRewards > 0) {
                totalRewards += levelRewards;
                referralRewards[msg.sender][level] = 0;
            }
        }
        
        require(totalRewards > 0, "No rewards to claim");
        require(usdtToken.transfer(msg.sender, totalRewards), "Reward transfer failed");
        
        emit RewardsClaimed(msg.sender, totalRewards);
    }
    
    function getReferralRewards(address user) external view returns (uint256[6] memory) {
        uint256[6] memory rewards;
        for (uint256 i = 0; i < 6; i++) {
            rewards[i] = referralRewards[user][i + 1];
        }
        return rewards;
    }
    
    // Admin functions for token management
    function depositTokens(address token, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        emit TokensDeposited(token, amount);
    }

    function depositUSDT(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.transferFrom(msg.sender, address(this), amount), "USDT transfer failed");
        emit TokensDeposited(address(usdtToken), amount);
    }

    function depositMyToken(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(myToken.transferFrom(msg.sender, address(this), amount), "MyToken transfer failed");
        emit TokensDeposited(address(myToken), amount);
    }

    function withdrawTokens(address token, uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(IERC20(token).transfer(owner(), amount), "Token transfer failed");
        emit TokensWithdrawn(token, amount);
    }

    function withdrawUSDT(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.transfer(owner(), amount), "USDT transfer failed");
        emit TokensWithdrawn(address(usdtToken), amount);
    }

    function withdrawMyToken(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(myToken.transfer(owner(), amount), "MyToken transfer failed");
        emit TokensWithdrawn(address(myToken), amount);
    }

    // View functions for token balances
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function getUSDTBalance() external view returns (uint256) {
        return usdtToken.balanceOf(address(this));
    }

    function getMyTokenBalance() external view returns (uint256) {
        return myToken.balanceOf(address(this));
    }
} 