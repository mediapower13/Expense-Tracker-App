// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenPayment
 * @dev Handle ERC20 token payments for expenses
 */
contract TokenPayment is Ownable, ReentrancyGuard {
    struct Payment {
        address payer;
        address token;
        uint256 amount;
        string purpose;
        uint256 timestamp;
        bool completed;
    }

    mapping(bytes32 => Payment) public payments;
    mapping(address => bool) public supportedTokens;

    event PaymentCreated(
        bytes32 indexed paymentId,
        address indexed payer,
        address token,
        uint256 amount,
        string purpose
    );

    event PaymentCompleted(
        bytes32 indexed paymentId,
        address indexed payer,
        uint256 timestamp
    );

    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);

    /**
     * @dev Add supported token
     */
    function addSupportedToken(address _token) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        supportedTokens[_token] = true;
        emit TokenAdded(_token);
    }

    /**
     * @dev Remove supported token
     */
    function removeSupportedToken(address _token) external onlyOwner {
        supportedTokens[_token] = false;
        emit TokenRemoved(_token);
    }

    /**
     * @dev Create and process payment
     */
    function processPayment(
        address _token,
        uint256 _amount,
        string memory _purpose
    ) external nonReentrant returns (bytes32) {
        require(supportedTokens[_token], "Token not supported");
        require(_amount > 0, "Amount must be greater than 0");

        bytes32 paymentId = keccak256(
            abi.encodePacked(msg.sender, _token, _amount, block.timestamp)
        );

        require(payments[paymentId].payer == address(0), "Payment already exists");

        // Transfer tokens from payer to contract
        IERC20 token = IERC20(_token);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        payments[paymentId] = Payment({
            payer: msg.sender,
            token: _token,
            amount: _amount,
            purpose: _purpose,
            timestamp: block.timestamp,
            completed: true
        });

        emit PaymentCreated(paymentId, msg.sender, _token, _amount, _purpose);
        emit PaymentCompleted(paymentId, msg.sender, block.timestamp);

        return paymentId;
    }

    /**
     * @dev Withdraw tokens (owner only)
     */
    function withdrawTokens(address _token, uint256 _amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        IERC20 token = IERC20(_token);
        require(token.transfer(owner(), _amount), "Withdrawal failed");
    }

    /**
     * @dev Get payment details
     */
    function getPayment(bytes32 _paymentId) 
        external 
        view 
        returns (Payment memory) 
    {
        return payments[_paymentId];
    }
}
