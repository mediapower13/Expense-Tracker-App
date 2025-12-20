"""
Blockchain database operations
Handles storage and retrieval of blockchain-related data
"""

from typing import List, Optional, Dict
from datetime import datetime
import json
from .blockchain_models import (
    BlockchainTransaction,
    WalletConnection,
    NFTReceipt,
    SmartContractExpense,
    TokenBalance
)


class BlockchainDatabase:
    """In-memory database for blockchain data"""
    
    def __init__(self):
        self.blockchain_transactions: List[BlockchainTransaction] = []
        self.wallet_connections: List[WalletConnection] = []
        self.nft_receipts: List[NFTReceipt] = []
        self.smart_contract_expenses: List[SmartContractExpense] = []
        self.token_balances: List[TokenBalance] = []
    
    # Blockchain Transaction Operations
    def add_blockchain_transaction(self, transaction: BlockchainTransaction) -> BlockchainTransaction:
        """Add a new blockchain transaction"""
        self.blockchain_transactions.append(transaction)
        return transaction
    
    def get_blockchain_transactions_by_address(self, address: str) -> List[BlockchainTransaction]:
        """Get all transactions for a specific address"""
        return [
            tx for tx in self.blockchain_transactions
            if tx.from_address.lower() == address.lower() or tx.to_address.lower() == address.lower()
        ]
    
    def get_blockchain_transaction_by_hash(self, tx_hash: str) -> Optional[BlockchainTransaction]:
        """Get transaction by hash"""
        for tx in self.blockchain_transactions:
            if tx.transaction_hash.lower() == tx_hash.lower():
                return tx
        return None
    
    # Wallet Connection Operations
    def add_wallet_connection(self, wallet: WalletConnection) -> WalletConnection:
        """Add or update wallet connection"""
        # Deactivate existing connections for this address
        for w in self.wallet_connections:
            if w.address.lower() == wallet.address.lower():
                w.is_active = False
        
        self.wallet_connections.append(wallet)
        return wallet
    
    def get_active_wallet_by_address(self, address: str) -> Optional[WalletConnection]:
        """Get active wallet connection"""
        for wallet in self.wallet_connections:
            if wallet.address.lower() == address.lower() and wallet.is_active:
                return wallet
        return None
    
    def disconnect_wallet(self, address: str) -> bool:
        """Disconnect wallet"""
        for wallet in self.wallet_connections:
            if wallet.address.lower() == address.lower() and wallet.is_active:
                wallet.is_active = False
                return True
        return False
    
    # NFT Receipt Operations
    def add_nft_receipt(self, receipt: NFTReceipt) -> NFTReceipt:
        """Add new NFT receipt"""
        self.nft_receipts.append(receipt)
        return receipt
    
    def get_nft_receipts_by_owner(self, owner_address: str) -> List[NFTReceipt]:
        """Get all NFT receipts for an owner"""
        return [
            receipt for receipt in self.nft_receipts
            if receipt.owner_address.lower() == owner_address.lower()
        ]
    
    def get_nft_receipt_by_token_id(self, token_id: str) -> Optional[NFTReceipt]:
        """Get NFT receipt by token ID"""
        for receipt in self.nft_receipts:
            if receipt.token_id == token_id:
                return receipt
        return None
    
    # Smart Contract Expense Operations
    def add_smart_contract_expense(self, expense: SmartContractExpense) -> SmartContractExpense:
        """Add smart contract expense"""
        self.smart_contract_expenses.append(expense)
        return expense
    
    def get_smart_contract_expenses_by_user(self, user_address: str) -> List[SmartContractExpense]:
        """Get all smart contract expenses for a user"""
        return [
            expense for expense in self.smart_contract_expenses
            if expense.user_address.lower() == user_address.lower()
        ]
    
    # Token Balance Operations
    def add_or_update_token_balance(self, balance: TokenBalance) -> TokenBalance:
        """Add or update token balance"""
        # Remove existing balance for same wallet/token/chain
        self.token_balances = [
            b for b in self.token_balances
            if not (
                b.wallet_address.lower() == balance.wallet_address.lower() and
                b.token_address.lower() == balance.token_address.lower() and
                b.chain_id == balance.chain_id
            )
        ]
        
        self.token_balances.append(balance)
        return balance
    
    def get_token_balances_by_wallet(self, wallet_address: str, chain_id: Optional[str] = None) -> List[TokenBalance]:
        """Get all token balances for a wallet"""
        balances = [
            b for b in self.token_balances
            if b.wallet_address.lower() == wallet_address.lower()
        ]
        
        if chain_id:
            balances = [b for b in balances if b.chain_id == chain_id]
        
        return balances
    
    # Utility Methods
    def get_stats_for_address(self, address: str) -> Dict:
        """Get comprehensive stats for an address"""
        transactions = self.get_blockchain_transactions_by_address(address)
        nft_receipts = self.get_nft_receipts_by_owner(address)
        token_balances = self.get_token_balances_by_wallet(address)
        
        return {
            "address": address,
            "total_transactions": len(transactions),
            "total_nft_receipts": len(nft_receipts),
            "total_tokens": len(token_balances),
            "total_spent": sum(
                tx.amount for tx in transactions
                if tx.from_address.lower() == address.lower() and tx.transaction_type == "expense"
            ),
            "total_received": sum(
                tx.amount for tx in transactions
                if tx.to_address.lower() == address.lower() and tx.transaction_type == "income"
            )
        }


# Global blockchain database instance
blockchain_db = BlockchainDatabase()
