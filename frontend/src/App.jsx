import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, User, Key, LogOut, Landmark, Send, CreditCard, ShieldCheck, Database } from 'lucide-react';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
const apiUrl = (path) => `${API_BASE_URL}${path}`;

export default function App() {
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({ balance: 0, transactions: [] });
  const [allUsers, setAllUsers] = useState([]); 
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');

  const fetchDashboardData = async (user) => {
    try {
      const resDash = await fetch(apiUrl(`/api/dashboard/${encodeURIComponent(user)}`));
      if (resDash.ok) setDashboardData(await resDash.json());
      const resUsers = await fetch(apiUrl('/api/users'));
      if (resUsers.ok) {
        const data = await resUsers.json();
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setMessage('Username is required');
      return;
    }
    try {
      const res = await fetch(apiUrl('/api/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data.message || 'Account Created! You can login now.');
        setView('login');
      } else {
        setMessage(data.detail || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Cannot connect to backend server.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setMessage('Username is required');
      return;
    }
    try {
      const res = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const loggedInUser = data.username || cleanUsername;
        setCurrentUser(loggedInUser);
        setView('dashboard');
        fetchDashboardData(loggedInUser);
        setMessage('');
      } else {
        setMessage(data.detail || 'Invalid ID or Password!');
      }
    } catch (err) {
      console.error(err);
      setMessage('Cannot connect to backend server.');
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || amount <= 0) return;
    const endpoint = type === 'DEPOSIT' ? '/api/deposit' : '/api/withdraw';
    
    const res = await fetch(apiUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, amount: parseFloat(amount) })
    });
    
    if (res.ok) {
      setAmount('');
      fetchDashboardData(currentUser);
      setMessage(`${type} Successful!`);
    } else {
      const err = await res.json();
      setMessage(err.detail);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleTransfer = async () => {
    if (!amount || amount <= 0 || !receiver) return;
    
    const res = await fetch(apiUrl('/api/transfer'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender: currentUser, receiver: receiver, amount: parseFloat(amount) })
    });
    
    if (res.ok) {
      setAmount('');
      setReceiver('');
      fetchDashboardData(currentUser);
      setMessage(`Sent to ${receiver} Successfully!`);
    } else {
      const err = await res.json();
      setMessage(err.detail);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    setView('login');
  };

  if (view === 'login' || view === 'register') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
          <div className="text-center mb-8">
            <Landmark size={48} className="mx-auto text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold">SecureBank Personal</h1>
            <p className="text-slate-400 mt-2">{view === 'login' ? 'Login to your account' : 'Create a new account'}</p>
          </div>

          {message && <div className="mb-4 p-3 bg-blue-900/50 text-blue-400 rounded text-center font-medium border border-blue-800">{message}</div>}

          <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input required type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
              {view === 'login' ? 'Secure Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="text-blue-400 hover:underline font-medium">
              {view === 'login' ? "Don't have an account? Create one" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wide">
            <Landmark size={28} className="text-blue-500" /> SecureBank
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-300">Welcome, {currentUser}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 bg-slate-800 hover:bg-red-600 px-4 py-2 rounded-lg transition-all border border-slate-700 hover:border-red-500">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Card & Quick Actions */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Credit Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <ShieldCheck size={28} className="text-emerald-400" />
              <CreditCard size={28} className="text-slate-400" />
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-sm mb-1 uppercase tracking-wider">Available Balance</p>
              <h2 className="text-4xl font-black mb-6">₹ {dashboardData.balance.toFixed(2)}</h2>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Card Holder</p>
                  <p className="font-bold tracking-widest">{currentUser.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Status</p>
                  <p className="font-bold text-emerald-400">ACTIVE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Quick Actions</h3>
            {message && <div className={`mb-4 text-sm font-bold text-center p-2 rounded ${message.includes('not found') || message.includes('Insufficient') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>{message}</div>}
            
            <input type="number" placeholder="Enter Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-slate-300 rounded-lg py-3 px-4 mb-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => handleTransaction('DEPOSIT')} className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors">
                <ArrowDownCircle size={20} /> Deposit
              </button>
              <button onClick={() => handleTransaction('WITHDRAW')} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors">
                <ArrowUpCircle size={20} /> Withdraw
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Transfer Money</h4>
              <input type="text" placeholder="Receiver Username" value={receiver} onChange={(e) => setReceiver(e.target.value)} className="w-full border border-slate-300 rounded-lg py-3 px-4 mb-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              <button onClick={handleTransfer} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-lg shadow-blue-200">
                <Send size={20} /> Send Money
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions & Live Vault Monitor */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* REAL-TIME ALL ACCOUNTS LIVE MONITOR */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 bg-gradient-to-r from-blue-50/30 to-transparent">
            <h3 className="font-bold text-lg text-blue-900 mb-4 flex items-center gap-2">
              <Database size={20} className="text-blue-600" /> Bank Vault Monitor (All Accounts Live)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allUsers.map((userObj, index) => (
                <button 
                  key={index} 
                  onClick={() => userObj.username !== currentUser && setReceiver(userObj.username)}
                  className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                    userObj.username === currentUser 
                      ? 'bg-slate-900 text-white border-slate-800' 
                      : 'bg-white text-slate-800 border-slate-200 hover:border-blue-500 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User size={18} className={userObj.username === currentUser ? 'text-blue-400' : 'text-slate-400'} />
                    <div>
                      <p className="font-bold">{userObj.username} {userObj.username === currentUser && '(You)'}</p>
                      <p className="text-xs opacity-60">Click to transfer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-60">Balance</p>
                    <p className="font-black">₹ {userObj.balance.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-xl mb-6 text-slate-800">My Recent Transactions</h3>
            {dashboardData.transactions.length === 0 ? (
              <div className="text-center text-slate-500 py-10">No transactions yet.</div>
            ) : (
              <div className="space-y-4">
                {dashboardData.transactions.map((txn, index) => {
                  const isPositive = txn.type === 'DEPOSIT' || txn.type.startsWith('RECEIVED');
                  return (
                    <div key={index} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                          {isPositive ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{txn.type}</p>
                          <p className="text-xs text-slate-500">{txn.date}</p>
                        </div>
                      </div>
                      <div className={`font-black text-lg ${isPositive ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {isPositive ? '+' : '-'} ₹{txn.amount.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}