from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

users_db = {} 
transactions_db = {} 

class User(BaseModel):
    username: str
    password: str

class Transaction(BaseModel):
    username: str
    amount: float

class Transfer(BaseModel):
    sender: str
    receiver: str
    amount: float

@app.post("/api/register")
def register(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already exists")
    users_db[user.username] = {"password": user.password, "balance": 0.0}
    transactions_db[user.username] = []
    return {"message": "Account created successfully"}

@app.post("/api/login")
def login(user: User):
    if user.username not in users_db or users_db[user.username]["password"] != user.password:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"username": user.username, "balance": users_db[user.username]["balance"]}

@app.post("/api/deposit")
def deposit(tx: Transaction):
    if tx.username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    users_db[tx.username]["balance"] += tx.amount
    
    txn_record = {"type": "DEPOSIT", "amount": tx.amount, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    transactions_db[tx.username].append(txn_record)
    return {"message": "Deposit successful"}

@app.post("/api/withdraw")
def withdraw(tx: Transaction):
    if tx.username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    if users_db[tx.username]["balance"] < tx.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds!")
        
    users_db[tx.username]["balance"] -= tx.amount
    txn_record = {"type": "WITHDRAWAL", "amount": tx.amount, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    transactions_db[tx.username].append(txn_record)
    return {"message": "Withdrawal successful"}

@app.post("/api/transfer")
def transfer_money(tx: Transfer):
    if tx.sender not in users_db or tx.receiver not in users_db:
        raise HTTPException(status_code=404, detail="Sender or Receiver not found")
    if tx.sender == tx.receiver:
        raise HTTPException(status_code=400, detail="Cannot transfer to yourself")
    if users_db[tx.sender]["balance"] < tx.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds!")

    users_db[tx.sender]["balance"] -= tx.amount
    transactions_db[tx.sender].append({"type": f"SENT TO {tx.receiver.upper()}", "amount": tx.amount, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    
    users_db[tx.receiver]["balance"] += tx.amount
    transactions_db[tx.receiver].append({"type": f"RECEIVED FROM {tx.sender.upper()}", "amount": tx.amount, "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
    
    return {"message": "Transfer successful"}

# UPDATE HUA HAI YE ENDPOINT
@app.get("/api/users")
def get_all_users():
    # Saare users ke naam aur balance dono bhej rahe hain
    return {"users": [{"username": k, "balance": v["balance"]} for k, v in users_db.items()]}

@app.get("/api/dashboard/{username}")
def get_dashboard(username: str):
    if username not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "balance": users_db[username]["balance"],
        "transactions": transactions_db[username][::-1] 
    }