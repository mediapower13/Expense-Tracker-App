"""
Data Models for Expense Tracker
Defines the structure of transactions and categories using dataclasses
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal, Optional, List, Dict
from enum import Enum
import uuid


class TransactionType(Enum):
    """Enum for transaction types"""
    INCOME = "income"
    EXPENSE = "expense"


@dataclass
class Transaction:
    """Represents a financial transaction"""
    type: Literal["income", "expense"]
    amount: float
    category: str
    description: str
    date: str
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    bank_account_id: Optional[str] = None
    payment_method: Optional[Literal["cash", "credit_card", "debit_card", "bank_transfer", "mobile_payment", "other"]] = None
    is_auto_sync: bool = False
    bank_transaction_id: Optional[str] = None
    merchant_name: Optional[str] = None
    location: Optional[str] = None
    
    def to_dict(self) -> Dict:
        """Convert transaction to dictionary"""
        return {
            "id": self.id,
            "type": self.type,
            "amount": self.amount,
            "category": self.category,
            "description": self.description,
            "date": self.date,
            "created_at": self.created_at,
            "bank_account_id": self.bank_account_id,
            "payment_method": self.payment_method,
            "is_auto_sync": self.is_auto_sync,
            "bank_transaction_id": self.bank_transaction_id,
            "merchant_name": self.merchant_name,
            "location": self.location,
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> "Transaction":
        """Create Transaction from dictionary"""
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            type=data["type"],
            amount=float(data["amount"]),
            category=data["category"],
            description=data["description"],
            date=data["date"],
            created_at=data.get("created_at", datetime.now().isoformat()),
            bank_account_id=data.get("bank_account_id"),
            payment_method=data.get("payment_method"),
            is_auto_sync=data.get("is_auto_sync", False),
            bank_transaction_id=data.get("bank_transaction_id"),
            merchant_name=data.get("merchant_name"),
            location=data.get("location"),
        )
    
    def is_income(self) -> bool:
        """Check if transaction is income"""
        return self.type == "income"
    
    def is_expense(self) -> bool:
        """Check if transaction is expense"""
        return self.type == "expense"
    
    def validate(self) -> List[str]:
        """Validate transaction data, returns list of errors"""
        errors = []
        if self.type not in ["income", "expense"]:
            errors.append("Type must be 'income' or 'expense'")
        if self.amount <= 0:
            errors.append("Amount must be positive")
        if not self.category:
            errors.append("Category is required")
        if not self.description:
            errors.append("Description is required")
        if not self.date:
            errors.append("Date is required")
        return errors


@dataclass
class Category:
    """Represents a transaction category"""
    name: str
    type: Literal["income", "expense"]
    color: str
    icon: str = "circle"
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    
    def to_dict(self) -> Dict:
        """Convert category to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "color": self.color,
            "icon": self.icon
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> "Category":
        """Create Category from dictionary"""
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            name=data["name"],
            type=data["type"],
            color=data["color"],
            icon=data.get("icon", "circle")
        )


@dataclass
class FinancialSummary:
    """Represents a financial summary"""
    total_income: float
    total_expenses: float
    balance: float
    transaction_count: int
    savings_rate: float
    
    def to_dict(self) -> Dict:
        """Convert summary to dictionary"""
        return {
            "total_income": self.total_income,
            "total_expenses": self.total_expenses,
            "balance": self.balance,
            "transaction_count": self.transaction_count,
            "savings_rate": self.savings_rate
        }
    
    @classmethod
    def calculate(cls, transactions: List[Transaction]) -> "FinancialSummary":
        """Calculate financial summary from transactions"""
        total_income = sum(t.amount for t in transactions if t.is_income())
        total_expenses = sum(t.amount for t in transactions if t.is_expense())
        balance = total_income - total_expenses
        savings_rate = round((balance / total_income * 100), 1) if total_income > 0 else 0
        
        return cls(
            total_income=total_income,
            total_expenses=total_expenses,
            balance=balance,
            transaction_count=len(transactions),
            savings_rate=savings_rate
        )


@dataclass
class CategoryBreakdown:
    """Represents breakdown by category"""
    category: str
    income: float = 0
    expense: float = 0
    count: int = 0
    
    def to_dict(self) -> Dict:
        """Convert breakdown to dictionary"""
        return {
            "category": self.category,
            "income": self.income,
            "expense": self.expense,
            "count": self.count
        }


@dataclass 
class Report:
    """Represents a financial report"""
    period: str
    start_date: str
    end_date: str
    summary: FinancialSummary
    category_breakdown: Dict[str, Dict]
    monthly_data: Dict[str, Dict]
    top_expenses: List[Dict]
    top_income: List[Dict]
    transaction_count: int
    
    def to_dict(self) -> Dict:
        """Convert report to dictionary"""
        return {
            "period": self.period,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "summary": self.summary.to_dict() if isinstance(self.summary, FinancialSummary) else self.summary,
            "category_breakdown": self.category_breakdown,
            "monthly_data": self.monthly_data,
            "top_expenses": self.top_expenses,
            "top_income": self.top_income,
            "transaction_count": self.transaction_count
        }


@dataclass
class BankAccount:
    """Represents a linked bank account"""
    bank_name: str
    account_name: str
    account_number: str
    account_type: Literal["checking", "savings", "credit_card", "investment"]
    balance: float
    currency: str = "USD"
    is_active: bool = True
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    linked_at: str = field(default_factory=lambda: datetime.now().isoformat())
    last_synced_at: Optional[str] = None
    
    def to_dict(self) -> Dict:
        """Convert bank account to dictionary"""
        return {
            "id": self.id,
            "bank_name": self.bank_name,
            "account_name": self.account_name,
            "account_number": self.account_number,
            "account_type": self.account_type,
            "balance": self.balance,
            "currency": self.currency,
            "is_active": self.is_active,
            "linked_at": self.linked_at,
            "last_synced_at": self.last_synced_at,
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> "BankAccount":
        """Create BankAccount from dictionary"""
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            bank_name=data["bank_name"],
            account_name=data["account_name"],
            account_number=data["account_number"],
            account_type=data["account_type"],
            balance=float(data.get("balance", 0)),
            currency=data.get("currency", "USD"),
            is_active=data.get("is_active", True),
            linked_at=data.get("linked_at", datetime.now().isoformat()),
            last_synced_at=data.get("last_synced_at"),
        )


@dataclass
class BankSync:
    """Represents a bank synchronization record"""
    bank_account_id: str
    status: Literal["pending", "syncing", "success", "failed"]
    transactions_synced: int = 0
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    last_sync_time: Optional[str] = field(default_factory=lambda: datetime.now().isoformat())
    error: Optional[str] = None
    
    def to_dict(self) -> Dict:
        """Convert bank sync to dictionary"""
        return {
            "id": self.id,
            "bank_account_id": self.bank_account_id,
            "status": self.status,
            "transactions_synced": self.transactions_synced,
            "last_sync_time": self.last_sync_time,
            "error": self.error,
        }
    
    @classmethod
    def from_dict(cls, data: Dict) -> "BankSync":
        """Create BankSync from dictionary"""
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            bank_account_id=data["bank_account_id"],
            status=data["status"],
            transactions_synced=data.get("transactions_synced", 0),
            last_sync_time=data.get("last_sync_time"),
            error=data.get("error"),
        )

