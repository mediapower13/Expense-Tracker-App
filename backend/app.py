from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json
import uuid
import os

app = Flask(__name__)
CORS(app)

# Data storage file path
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data.json')

# Default categories
DEFAULT_CATEGORIES = [
    {"id": "1", "name": "Salary", "type": "income", "color": "#10b981", "icon": "wallet"},
    {"id": "2", "name": "Freelance", "type": "income", "color": "#06b6d4", "icon": "laptop"},
    {"id": "3", "name": "Investments", "type": "income", "color": "#8b5cf6", "icon": "trending-up"},
    {"id": "4", "name": "Other Income", "type": "income", "color": "#f59e0b", "icon": "gift"},
    {"id": "5", "name": "Food & Dining", "type": "expense", "color": "#ef4444", "icon": "utensils"},
    {"id": "6", "name": "Transportation", "type": "expense", "color": "#f97316", "icon": "car"},
    {"id": "7", "name": "Shopping", "type": "expense", "color": "#ec4899", "icon": "shopping-bag"},
    {"id": "8", "name": "Bills & Utilities", "type": "expense", "color": "#6366f1", "icon": "file-text"},
    {"id": "9", "name": "Entertainment", "type": "expense", "color": "#14b8a6", "icon": "film"},
    {"id": "10", "name": "Healthcare", "type": "expense", "color": "#f43f5e", "icon": "heart-pulse"},
    {"id": "11", "name": "Education", "type": "expense", "color": "#3b82f6", "icon": "book-open"},
    {"id": "12", "name": "Other Expense", "type": "expense", "color": "#71717a", "icon": "package"},
]

# Sample transactions for demo
SAMPLE_TRANSACTIONS = [
    {"id": "1", "type": "income", "amount": 5000, "category": "Salary", "description": "Monthly salary", "date": "2025-11-01", "created_at": "2025-11-01T09:00:00Z"},
    {"id": "2", "type": "income", "amount": 1200, "category": "Freelance", "description": "Web project", "date": "2025-11-05", "created_at": "2025-11-05T14:30:00Z"},
    {"id": "3", "type": "expense", "amount": 150, "category": "Food & Dining", "description": "Grocery shopping", "date": "2025-11-03", "created_at": "2025-11-03T10:15:00Z"},
    {"id": "4", "type": "expense", "amount": 80, "category": "Transportation", "description": "Gas refill", "date": "2025-11-04", "created_at": "2025-11-04T16:00:00Z"},
    {"id": "5", "type": "expense", "amount": 200, "category": "Bills & Utilities", "description": "Electricity bill", "date": "2025-11-06", "created_at": "2025-11-06T11:00:00Z"},
    {"id": "6", "type": "expense", "amount": 50, "category": "Entertainment", "description": "Movie tickets", "date": "2025-11-08", "created_at": "2025-11-08T19:30:00Z"},
    {"id": "7", "type": "income", "amount": 300, "category": "Investments", "description": "Dividend payout", "date": "2025-11-10", "created_at": "2025-11-10T08:00:00Z"},
    {"id": "8", "type": "expense", "amount": 120, "category": "Shopping", "description": "New clothes", "date": "2025-11-12", "created_at": "2025-11-12T15:45:00Z"},
    {"id": "9", "type": "expense", "amount": 45, "category": "Healthcare", "description": "Pharmacy", "date": "2025-11-14", "created_at": "2025-11-14T09:30:00Z"},
    {"id": "10", "type": "expense", "amount": 250, "category": "Education", "description": "Online course", "date": "2025-11-15", "created_at": "2025-11-15T12:00:00Z"},
    {"id": "11", "type": "income", "amount": 800, "category": "Freelance", "description": "Design work", "date": "2025-11-18", "created_at": "2025-11-18T14:00:00Z"},
    {"id": "12", "type": "expense", "amount": 180, "category": "Food & Dining", "description": "Restaurant dinner", "date": "2025-11-20", "created_at": "2025-11-20T20:00:00Z"},
]


def load_data():
    """Load data from JSON file or initialize with defaults"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            pass
    
    return {
        "transactions": SAMPLE_TRANSACTIONS.copy(),
        "categories": DEFAULT_CATEGORIES.copy()
    }


def save_data(data):
    """Save data to JSON file"""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def calculate_summary(transactions):
    """Calculate financial summary from transactions"""
    total_income = sum(t['amount'] for t in transactions if t['type'] == 'income')
    total_expenses = sum(t['amount'] for t in transactions if t['type'] == 'expense')
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": total_income - total_expenses,
        "transaction_count": len(transactions),
        "savings_rate": round((total_income - total_expenses) / total_income * 100, 1) if total_income > 0 else 0
    }


def get_category_breakdown(transactions):
    """Get breakdown of amounts by category"""
    breakdown = {}
    for t in transactions:
        cat = t['category']
        if cat not in breakdown:
            breakdown[cat] = {"income": 0, "expense": 0, "count": 0}
        
        if t['type'] == 'income':
            breakdown[cat]['income'] += t['amount']
        else:
            breakdown[cat]['expense'] += t['amount']
        breakdown[cat]['count'] += 1
    
    return breakdown


def get_monthly_data(transactions):
    """Get monthly income and expense totals"""
    monthly = {}
    for t in transactions:
        month = t['date'][:7]
        if month not in monthly:
            monthly[month] = {"income": 0, "expense": 0}
        
        if t['type'] == 'income':
            monthly[month]['income'] += t['amount']
        else:
            monthly[month]['expense'] += t['amount']
    
    return monthly


# ============== API ROUTES ==============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})


@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions with summary data"""
    data = load_data()
    transactions = data['transactions']
    transactions.sort(key=lambda x: x['date'], reverse=True)
    
    return jsonify({
        "transactions": transactions,
        "summary": calculate_summary(transactions),
        "categoryBreakdown": get_category_breakdown(transactions),
        "monthlyData": get_monthly_data(transactions)
    })


@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    """Add a new transaction"""
    data = load_data()
    body = request.get_json()
    
    required = ['type', 'amount', 'category', 'description', 'date']
    for field in required:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    if body['type'] not in ['income', 'expense']:
        return jsonify({"error": "Type must be 'income' or 'expense'"}), 400
    
    try:
        amount = float(body['amount'])
        if amount <= 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({"error": "Amount must be a positive number"}), 400
    
    new_transaction = {
        "id": str(uuid.uuid4()),
        "type": body['type'],
        "amount": amount,
        "category": body['category'],
        "description": body['description'],
        "date": body['date'],
        "created_at": datetime.now().isoformat()
    }
    
    data['transactions'].insert(0, new_transaction)
    save_data(data)
    
    return jsonify(new_transaction), 201


@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Delete a transaction by ID"""
    data = load_data()
    original_length = len(data['transactions'])
    
    data['transactions'] = [t for t in data['transactions'] if t['id'] != transaction_id]
    
    if len(data['transactions']) == original_length:
        return jsonify({"error": "Transaction not found"}), 404
    
    save_data(data)
    return jsonify({"success": True, "message": "Transaction deleted"})


@app.route('/api/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    """Update a transaction by ID"""
    data = load_data()
    body = request.get_json()
    
    for i, t in enumerate(data['transactions']):
        if t['id'] == transaction_id:
            data['transactions'][i] = {**t, **body, "id": transaction_id}
            save_data(data)
            return jsonify(data['transactions'][i])
    
    return jsonify({"error": "Transaction not found"}), 404


@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    data = load_data()
    return jsonify(data['categories'])


@app.route('/api/categories', methods=['POST'])
def add_category():
    """Add a new category"""
    data = load_data()
    body = request.get_json()
    
    required = ['name', 'type', 'color']
    for field in required:
        if field not in body:
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    new_category = {
        "id": str(uuid.uuid4()),
        "name": body['name'],
        "type": body['type'],
        "color": body['color'],
        "icon": body.get('icon', 'circle')
    }
    
    data['categories'].append(new_category)
    save_data(data)
    
    return jsonify(new_category), 201


@app.route('/api/reports', methods=['GET'])
def get_reports():
    """Get financial reports with period filtering"""
    data = load_data()
    period = request.args.get('period', 'month')
    
    today = datetime.now()
    if period == 'week':
        start_date = (today - timedelta(days=7)).strftime('%Y-%m-%d')
    elif period == 'month':
        start_date = (today - timedelta(days=30)).strftime('%Y-%m-%d')
    elif period == 'year':
        start_date = (today - timedelta(days=365)).strftime('%Y-%m-%d')
    else:
        start_date = '1970-01-01'
    
    filtered = [t for t in data['transactions'] if t['date'] >= start_date]
    
    summary = calculate_summary(filtered)
    category_breakdown = get_category_breakdown(filtered)
    monthly_data = get_monthly_data(filtered)
    
    expenses = [t for t in filtered if t['type'] == 'expense']
    expenses.sort(key=lambda x: x['amount'], reverse=True)
    top_expenses = expenses[:5]
    
    income = [t for t in filtered if t['type'] == 'income']
    income.sort(key=lambda x: x['amount'], reverse=True)
    top_income = income[:5]
    
    return jsonify({
        "period": period,
        "start_date": start_date,
        "end_date": today.strftime('%Y-%m-%d'),
        "summary": summary,
        "category_breakdown": category_breakdown,
        "monthly_data": monthly_data,
        "top_expenses": top_expenses,
        "top_income": top_income,
        "transaction_count": len(filtered)
    })


@app.route('/api/export', methods=['GET'])
def export_data():
    """Export all data as JSON"""
    data = load_data()
    return jsonify({
        "exported_at": datetime.now().isoformat(),
        "data": data
    })


@app.route('/api/import', methods=['POST'])
def import_data():
    """Import data from JSON"""
    body = request.get_json()
    
    if 'data' not in body:
        return jsonify({"error": "Missing data field"}), 400
    
    imported = body['data']
    
    if 'transactions' not in imported or 'categories' not in imported:
        return jsonify({"error": "Invalid data format"}), 400
    
    save_data(imported)
    return jsonify({"success": True, "message": "Data imported successfully"})


if __name__ == '__main__':
    print("=" * 60)
    print("       EXPENSE TRACKER - Python Backend Server")
    print("=" * 60)
    print(f"  Server running on: http://localhost:5000")
    print("")
    print("  API Endpoints:")
    print("  ─────────────────────────────────────────────")
    print("  GET    /api/health              Health check")
    print("  GET    /api/transactions        Get all transactions")
    print("  POST   /api/transactions        Add transaction")
    print("  PUT    /api/transactions/<id>   Update transaction")
    print("  DELETE /api/transactions/<id>   Delete transaction")
    print("  GET    /api/categories          Get categories")
    print("  POST   /api/categories          Add category")
    print("  GET    /api/reports             Get reports")
    print("  GET    /api/export              Export data")
    print("  POST   /api/import              Import data")
    print("=" * 60)
    
    app.run(debug=True, port=5000, host='0.0.0.0')
