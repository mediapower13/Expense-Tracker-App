"""
Blockchain integration models for Expense Tracker
Extends the existing models with blockchain/Web3 support
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List, Dict
import uuid


@dataclass
class BlockchainTransaction:
    """Represents a blockchain transaction"""
    transaction_hash: str
    from_address: str
    to_address: str
    amount: float
    token_symbol: str
    chain_id: str
    timestamp: str
    status: str  # pending, confirmed, failed
    gas_used: Optional[str] = None
    gas_fee: Optional[str] = None
    block_number: Optional[int] = None
    transaction_type: str = "expense"  # expense, income, transfer
    category: Optional[str] = None
    description: Optional[str] = None
    nft_receipt_id: Optional[str] = None
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "transaction_hash": self.transaction_hash,
            "from_address": self.from_address,
            "to_address": self.to_address,
            "amount": self.amount,
            "token_symbol": self.token_symbol,
            "chain_id": self.chain_id,
            "timestamp": self.timestamp,
            "status": self.status,
            "gas_used": self.gas_used,
            "gas_fee": self.gas_fee,
            "block_number": self.block_number,
            "transaction_type": self.transaction_type,
            "category": self.category,
            "description": self.description,
            "nft_receipt_id": self.nft_receipt_id
        }


@dataclass
class WalletConnection:
    """Represents a connected wallet"""
    address: str
    chain_id: str
    balance: str
    connected_at: str
    user_id: Optional[str] = None
    wallet_type: str = "metamask"  # metamask, walletconnect, coinbase
    is_active: bool = True
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "address": self.address,
            "chain_id": self.chain_id,
            "balance": self.balance,
            "connected_at": self.connected_at,
            "user_id": self.user_id,
            "wallet_type": self.wallet_type,
            "is_active": self.is_active
        }


@dataclass
class NFTReceipt:
    """Represents an NFT receipt minted for an expense"""
    token_id: str
    contract_address: str
    owner_address: str
    transaction_hash: str
    amount: float
    category: str
    description: str
    merchant: Optional[str]
    minted_at: str
    metadata_uri: Optional[str] = None
    image_url: Optional[str] = None
    chain_id: str = "0x1"
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "token_id": self.token_id,
            "contract_address": self.contract_address,
            "owner_address": self.owner_address,
            "transaction_hash": self.transaction_hash,
            "amount": self.amount,
            "category": self.category,
            "description": self.description,
            "merchant": self.merchant,
            "minted_at": self.minted_at,
            "metadata_uri": self.metadata_uri,
            "image_url": self.image_url,
            "chain_id": self.chain_id
        }


@dataclass
class SmartContractExpense:
    """Represents an expense stored on smart contract"""
    contract_id: str
    user_address: str
    amount: float
    category: str
    description: str
    is_recurring: bool
    recurring_interval: Optional[int]  # in days
    created_at: str
    chain_id: str
    contract_address: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "contract_id": self.contract_id,
            "user_address": self.user_address,
            "amount": self.amount,
            "category": self.category,
            "description": self.description,
            "is_recurring": self.is_recurring,
            "recurring_interval": self.recurring_interval,
            "created_at": self.created_at,
            "chain_id": self.chain_id,
            "contract_address": self.contract_address
        }


@dataclass
class TokenBalance:
    """Represents token balance for a wallet"""
    wallet_address: str
    token_symbol: str
    token_name: str
    token_address: str
    balance: str
    decimals: int
    chain_id: str
    value_usd: Optional[float] = None
    last_updated: str = field(default_factory=lambda: datetime.now().isoformat())
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "id": self.id,
            "wallet_address": self.wallet_address,
            "token_symbol": self.token_symbol,
            "token_name": self.token_name,
            "token_address": self.token_address,
            "balance": self.balance,
            "decimals": self.decimals,
            "chain_id": self.chain_id,
            "value_usd": self.value_usd,
            "last_updated": self.last_updated
        }
