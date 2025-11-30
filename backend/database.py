"""
Database Handler for Expense Tracker
Manages data persistence using SQLite with connection pooling
"""

import sqlite3
import os
from datetime import datetime
from typing import Optional, List, Dict
from contextlib import contextmanager
from models import Transaction, Category, FinancialSummary


class Database:
    """SQLite database handler for expense tracker"""
    
    def __init__(self, db_path: str = "expense_tracker.db"):
        self.db_path = os.path.join(os.path.dirname(__file__), db_path)
        self._init_database()
    
    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def _init_database(self):
        """Initialize database tables and indexes"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Create transactions table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS transactions (
                    id TEXT PRIMARY KEY,
                    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
                    amount REAL NOT NULL CHECK(amount > 0),
                    category TEXT NOT NULL,
                    description TEXT,
                    date TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            
            # Create categories table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS categories (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
                    color TEXT NOT NULL,
                    icon TEXT DEFAULT 'circle'
                )
            ''')
            
            # Create indexes for faster queries
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_transactions_date 
                ON transactions(date DESC)
            ''')
            
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_transactions_type 
                ON transactions(type)
            ''')
            
            cursor.execute('''
                CREATE INDEX IF NOT EXISTS idx_transactions_category 
                ON transactions(category)
            ''')
            
            # Insert default categories if empty
            cursor.execute('SELECT COUNT(*) FROM categories')
            if cursor.fetchone()[0] == 0:
                self._insert_default_categories(cursor)
    
    def _insert_default_categories(self, cursor):
        """Insert default categories"""
        default_categories = [
            ("1", "Salary", "income", "#10b981", "wallet"),
            ("2", "Freelance", "income", "#06b6d4", "laptop"),
            ("3", "Investments", "income", "#8b5cf6", "trending-up"),
            ("4", "Other Income", "income", "#f59e0b", "gift"),
            ("5", "Food & Dining", "expense", "#ef4444", "utensils"),
            ("6", "Transportation", "expense", "#f97316", "car"),
            ("7", "Shopping", "expense", "#ec4899", "shopping-bag"),
            ("8", "Bills & Utilities", "expense", "#6366f1", "file-text"),
            ("9", "Entertainment", "expense", "#14b8a6", "film"),
            ("10", "Healthcare", "expense", "#f43f5e", "heart-pulse"),
            ("11", "Education", "expense", "#3b82f6", "book-open"),
            ("12", "Other Expense", "expense", "#71717a", "package"),
        ]
        
        cursor.executemany('''
            INSERT INTO categories (id, name, type, color, icon)
            VALUES (?, ?, ?, ?, ?)
        ''', default_categories)
    
    # ============== TRANSACTION OPERATIONS ==============
    
    def get_all_transactions(self) -> List[Dict]:
        """Get all transactions sorted by date"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM transactions 
                ORDER BY date DESC, created_at DESC
            ''')
            return [dict(row) for row in cursor.fetchall()]
    
    def get_transaction_by_id(self, transaction_id: str) -> Optional[Dict]:
        """Get a single transaction by ID"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM transactions WHERE id = ?', (transaction_id,))
            row = cursor.fetchone()
            return dict(row) if row else None
    
    def add_transaction(self, transaction: Dict) -> Dict:
        """Add a new transaction"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO transactions (id, type, amount, category, description, date, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                transaction['id'],
                transaction['type'],
                transaction['amount'],
                transaction['category'],
                transaction['description'],
                transaction['date'],
                transaction['created_at']
            ))
            return transaction
    
    def update_transaction(self, transaction_id: str, updates: Dict) -> Optional[Dict]:
        """Update an existing transaction"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            set_clause = ', '.join(f'{k} = ?' for k in updates.keys())
            values = list(updates.values()) + [transaction_id]
            
            cursor.execute(f'''
                UPDATE transactions SET {set_clause} WHERE id = ?
            ''', values)
            
            if cursor.rowcount > 0:
                return self.get_transaction_by_id(transaction_id)
            return None
    
    def delete_transaction(self, transaction_id: str) -> bool:
        """Delete a transaction"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM transactions WHERE id = ?', (transaction_id,))
            return cursor.rowcount > 0
    
    # ============== CATEGORY OPERATIONS ==============
    
    def get_all_categories(self) -> List[Dict]:
        """Get all categories"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM categories ORDER BY type, name')
            return [dict(row) for row in cursor.fetchall()]
    
    def add_category(self, category: Dict) -> Dict:
        """Add a new category"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO categories (id, name, type, color, icon)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                category['id'],
                category['name'],
                category['type'],
                category['color'],
                category.get('icon', 'circle')
            ))
            return category
    
    def delete_category(self, category_id: str) -> bool:
        """Delete a category"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM categories WHERE id = ?', (category_id,))
            return cursor.rowcount > 0
    
    # ============== REPORTING QUERIES ==============
    
    def get_transactions_by_date_range(self, start_date: str, end_date: str) -> List[Dict]:
        """Get transactions within a date range"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM transactions 
                WHERE date >= ? AND date <= ?
                ORDER BY date DESC
            ''', (start_date, end_date))
            return [dict(row) for row in cursor.fetchall()]
    
    def get_summary(self) -> Dict:
        """Get financial summary"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT 
                    COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
                    COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expenses,
                    COUNT(*) as transaction_count
                FROM transactions
            ''')
            
            row = cursor.fetchone()
            total_income = row['total_income']
            total_expenses = row['total_expenses']
            
            return {
                "total_income": total_income,
                "total_expenses": total_expenses,
                "balance": total_income - total_expenses,
                "transaction_count": row['transaction_count'],
                "savings_rate": round((total_income - total_expenses) / total_income * 100, 1) if total_income > 0 else 0
            }
    
    def get_category_breakdown(self) -> Dict:
        """Get breakdown by category"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    category,
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense,
                    COUNT(*) as count
                FROM transactions
                GROUP BY category
            ''')
            
            return {row['category']: {
                "income": row['income'],
                "expense": row['expense'],
                "count": row['count']
            } for row in cursor.fetchall()}
    
    def get_monthly_data(self) -> Dict:
        """Get monthly income and expense totals"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT 
                    strftime('%Y-%m', date) as month,
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
                FROM transactions
                GROUP BY strftime('%Y-%m', date)
                ORDER BY month
            ''')
            
            return {row['month']: {
                "income": row['income'],
                "expense": row['expense']
            } for row in cursor.fetchall()}


# Singleton instance
_db_instance: Optional[Database] = None


def get_database() -> Database:
    """Get or create database instance"""
    global _db_instance
    if _db_instance is None:
        _db_instance = Database()
    return _db_instance
