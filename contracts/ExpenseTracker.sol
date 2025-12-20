// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ExpenseTracker
 * @dev Smart contract for tracking expenses on the blockchain
 */
contract ExpenseTracker is Ownable, ReentrancyGuard {
    struct Expense {
        uint256 id;
        address user;
        uint256 amount;
        string category;
        string description;
        uint256 timestamp;
        bool isRecurring;
        uint256 recurringInterval;
    }

    struct Budget {
        uint256 monthlyLimit;
        uint256 currentSpent;
        uint256 lastResetTimestamp;
    }

    mapping(address => Expense[]) private userExpenses;
    mapping(address => Budget) private userBudgets;
    mapping(address => uint256) private expenseCounter;

    event ExpenseAdded(
        address indexed user,
        uint256 indexed expenseId,
        uint256 amount,
        string category,
        uint256 timestamp
    );

    event BudgetSet(
        address indexed user,
        uint256 monthlyLimit,
        uint256 timestamp
    );

    event BudgetExceeded(
        address indexed user,
        uint256 spent,
        uint256 limit
    );

    constructor() {}

    /**
     * @dev Add a new expense
     */
    function addExpense(
        uint256 _amount,
        string memory _category,
        string memory _description,
        bool _isRecurring,
        uint256 _recurringInterval
    ) external {
        uint256 expenseId = expenseCounter[msg.sender]++;
        
        Expense memory newExpense = Expense({
            id: expenseId,
            user: msg.sender,
            amount: _amount,
            category: _category,
            description: _description,
            timestamp: block.timestamp,
            isRecurring: _isRecurring,
            recurringInterval: _recurringInterval
        });

        userExpenses[msg.sender].push(newExpense);

        // Update budget tracking
        _updateBudget(msg.sender, _amount);

        emit ExpenseAdded(msg.sender, expenseId, _amount, _category, block.timestamp);
    }

    /**
     * @dev Set monthly budget limit
     */
    function setBudget(uint256 _monthlyLimit) external {
        userBudgets[msg.sender] = Budget({
            monthlyLimit: _monthlyLimit,
            currentSpent: 0,
            lastResetTimestamp: block.timestamp
        });

        emit BudgetSet(msg.sender, _monthlyLimit, block.timestamp);
    }

    /**
     * @dev Get user's expenses
     */
    function getExpenses() external view returns (Expense[] memory) {
        return userExpenses[msg.sender];
    }

    /**
     * @dev Get user's budget info
     */
    function getBudget() external view returns (Budget memory) {
        return userBudgets[msg.sender];
    }

    /**
     * @dev Get expense by ID
     */
    function getExpense(uint256 _expenseId) external view returns (Expense memory) {
        require(_expenseId < userExpenses[msg.sender].length, "Expense not found");
        return userExpenses[msg.sender][_expenseId];
    }

    /**
     * @dev Internal function to update budget
     */
    function _updateBudget(address _user, uint256 _amount) private {
        Budget storage budget = userBudgets[_user];
        
        // Reset budget if month has passed
        if (block.timestamp >= budget.lastResetTimestamp + 30 days) {
            budget.currentSpent = 0;
            budget.lastResetTimestamp = block.timestamp;
        }

        budget.currentSpent += _amount;

        // Check if budget exceeded
        if (budget.currentSpent > budget.monthlyLimit && budget.monthlyLimit > 0) {
            emit BudgetExceeded(_user, budget.currentSpent, budget.monthlyLimit);
        }
    }

    /**
     * @dev Get total expenses for user
     */
    function getTotalExpenses() external view returns (uint256) {
        uint256 total = 0;
        Expense[] memory expenses = userExpenses[msg.sender];
        
        for (uint256 i = 0; i < expenses.length; i++) {
            total += expenses[i].amount;
        }
        
        return total;
    }

    /**
     * @dev Get expenses by category
     */
    function getExpensesByCategory(string memory _category) 
        external 
        view 
        returns (Expense[] memory) 
    {
        Expense[] memory allExpenses = userExpenses[msg.sender];
        uint256 count = 0;

        // Count matching expenses
        for (uint256 i = 0; i < allExpenses.length; i++) {
            if (keccak256(bytes(allExpenses[i].category)) == keccak256(bytes(_category))) {
                count++;
            }
        }

        // Create result array
        Expense[] memory result = new Expense[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < allExpenses.length; i++) {
            if (keccak256(bytes(allExpenses[i].category)) == keccak256(bytes(_category))) {
                result[index] = allExpenses[i];
                index++;
            }
        }

        return result;
    }
}
