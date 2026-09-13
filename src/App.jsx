import React, { useState, useEffect } from 'react';
import { 
  Calendar, PlusCircle, Wifi, WifiOff, 
  ChevronLeft, ChevronRight, Trash2, LayoutDashboard, 
  BarChart3, Lock, LogOut, ShieldCheck, UserCheck, 
  Search, Wallet, ArrowDownLeft, ArrowUpRight,
  Clock, CheckCircle2, Filter, Calculator, PieChart as PieIcon,
  Eye, EyeOff, KeyRound, HelpCircle, Sparkles, ArrowRight
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyCSqQ0_tBbL_VhgNK5PjEnhh5_E-_K2YIk",
  authDomain: "pocket-pulse-607bc.firebaseapp.com",
  projectId: "pocket-pulse-607bc",
  storageBucket: "pocket-pulse-607bc.firebasestorage.app",
  messagingSenderId: "443533839623",
  appId: "1:443533839623:web:db473c0fc09264b52e09a2",
  measurementId: "G-RG7TFM5D5H"
};

const getDb = () => {
  if (typeof window !== "undefined" && window.firebase) {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
    return window.firebase.firestore();
  }
  return null;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatToISODate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getLiveTimestamp = () => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dateStr}, ${timeStr}`;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [activePin, setActivePin] = useState(() => {
    return localStorage.getItem("pocketpulse_active_pin") || "";
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("pocketpulse_logged_in") === "true";
  });

  const [authMode, setAuthMode] = useState("login");
  const [inputPin, setInputPin] = useState("");
  const [inputSec, setInputSec] = useState("");
  const [newPin, setNewPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [showPinText, setShowPinText] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");

  const getDefaultCycleData = () => {
    const now = new Date();
    const currentMonthTitle = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
    return [
      {
        month: `${currentMonthTitle} (Current)`,
        budget: 0,
        inflowHistory: [],
        expenses: []
      }
    ];
  };

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("pocketpulse_ledger_store_v14");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return getDefaultCycleData();
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnalyticsIdx, setSelectedAnalyticsIdx] = useState(0);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [fundSource, setFundSource] = useState("");

  const [dateFilterMode, setDateFilterMode] = useState("all");
  const [customFilterDate, setCustomFilterDate] = useState(formatToISODate(new Date()));

  // Cloud Firestore Synchronization Listener
  useEffect(() => {
    if (!isAuthenticated || !activePin) return;

    const db = getDb();
    if (!db) return;

    const unsubscribe = db.collection("vaults").doc(activePin).onSnapshot((docSnap) => {
      if (docSnap.exists) {
        const cloudData = docSnap.data().ledgerData;
        if (cloudData && Array.isArray(cloudData)) {
          setData(cloudData);
          localStorage.setItem("pocketpulse_ledger_store_v14", JSON.stringify(cloudData));
          setCurrentIdx(prev => Math.min(prev, cloudData.length - 1));
          setSelectedAnalyticsIdx(prev => Math.min(prev, cloudData.length - 1));
        }
      }
    }, (err) => {
      console.error("Firestore sync error:", err);
    });

    return () => unsubscribe();
  }, [isAuthenticated, activePin]);

  const updateDataBoth = async (updatedData) => {
    setData(updatedData);
    localStorage.setItem("pocketpulse_ledger_store_v14", JSON.stringify(updatedData));
    if (activePin) {
      try {
        const db = getDb();
        if (db) {
          await db.collection("vaults").doc(activePin).set({ 
            ledgerData: updatedData, 
            lastModified: new Date().toISOString() 
          }, { merge: true });
        }
      } catch (err) {
        console.error("Failed to sync to cloud:", err);
      }
    }
  };

  const activeMonth = data[currentIdx] || data[0];
  const totalSpent = activeMonth.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = activeMonth.budget - totalSpent;
  const spentPercent = activeMonth.budget > 0 
    ? Math.min(100, Math.round((totalSpent / activeMonth.budget) * 100))
    : (totalSpent > 0 ? 100 : 0);
  const savingsRate = activeMonth.budget > 0 
    ? Math.max(0, Math.round((remaining / activeMonth.budget) * 100))
    : 0;

  const distinctDaysCount = Math.max(1, new Set(activeMonth.expenses.map(e => e.isoDate || "")).size);
  const dailyAverageSpend = Math.round(totalSpent / distinctDaysCount);

  const todayISO = formatToISODate(new Date());
  const yesterdayDateObj = new Date();
  yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1);
  const yesterdayISO = formatToISODate(yesterdayDateObj);

  const filteredExpenses = activeMonth.expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (dateFilterMode === "today") return e.isoDate === todayISO;
    if (dateFilterMode === "yesterday") return e.isoDate === yesterdayISO;
    if (dateFilterMode === "custom") return e.isoDate === customFilterDate;
    return true;
  });

  const calculateDiscipline = (spent, budget) => {
    if (budget === 0 && spent === 0) return { score: 100, grade: "Baseline Set", percent: 0 };
    if (budget === 0 && spent > 0) return { score: 15, grade: "Grade C (Unallocated Spend)", percent: 100 };
    const percent = Math.min(100, Math.round((spent / budget) * 100));
    const score = Math.max(10, Math.min(100, Math.round(100 - (percent * 0.7))));
    const grade = score >= 80 ? "Grade A (Optimal)" : score >= 60 ? "Grade B (Moderate)" : "Grade C (Critical)";
    return { score, grade, percent };
  };

  const currentDiscipline = calculateDiscipline(totalSpent, activeMonth.budget);

  // Authentication Handlers
  const handleSetupPin = async (e) => {
    e.preventDefault();
    const pin = inputPin.trim();
    const sec = inputSec.trim().toLowerCase();

    if (pin.length < 4) {
      setAuthError("Passcode must contain at least 4 alphanumeric characters.");
      return;
    }
    if (!sec) {
      setAuthError("Please provide a recovery keyword.");
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError("");
      const db = getDb();
      if (!db) throw new Error("Database service unavailable.");

      const docSnap = await db.collection("vaults").doc(pin).get();

      if (docSnap.exists) {
        setAuthError("This passcode is already claimed. Choose a different unique passcode.");
        setIsAuthenticating(false);
        return;
      }

      const initialLedger = getDefaultCycleData();
      await db.collection("vaults").doc(pin).set({
        pin: pin,
        secAnswer: sec,
        ledgerData: initialLedger,
        createdAt: new Date().toISOString()
      });

      setActivePin(pin);
      localStorage.setItem("pocketpulse_active_pin", pin);
      setData(initialLedger);
      setIsAuthenticated(true);
      localStorage.setItem("pocketpulse_logged_in", "true");
      triggerToast("Unique Vault Initialized & Synced", "success");
    } catch (err) {
      setAuthError("Network error: " + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const pin = inputPin.trim();
    if (!pin) {
      setAuthError("Please provide your passcode.");
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError("");
      const db = getDb();
      if (!db) throw new Error("Database service unavailable.");

      const docSnap = await db.collection("vaults").doc(pin).get();

      if (docSnap.exists) {
        const cloudData = docSnap.data().ledgerData || getDefaultCycleData();
        setActivePin(pin);
        localStorage.setItem("pocketpulse_active_pin", pin);
        setData(cloudData);
        localStorage.setItem("pocketpulse_ledger_store_v14", JSON.stringify(cloudData));
        setIsAuthenticated(true);
        localStorage.setItem("pocketpulse_logged_in", "true");
        triggerToast("Ledger Synchronized & Unlocked", "success");
      } else {
        setAuthError("Invalid passcode or vault not registered.");
      }
    } catch (err) {
      setAuthError("Connection failure: " + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleForgotVerify = async (e) => {
    e.preventDefault();
    const pin = inputPin.trim();
    const sec = inputSec.trim().toLowerCase();

    if (!pin || !sec) {
      setAuthError("Both Passcode and Keyword are required.");
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError("");
      const db = getDb();
      if (!db) throw new Error("Database service unavailable.");

      const docSnap = await db.collection("vaults").doc(pin).get();

      if (docSnap.exists && docSnap.data().secAnswer === sec) {
        setAuthMode("reset");
      } else {
        setAuthError("Verification failed: Passcode or Keyword incorrect.");
      }
    } catch (err) {
      setAuthError("Verification error: " + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleResetPin = async (e) => {
    e.preventDefault();
    const nPin = newPin.trim();
    if (nPin.length < 4) {
      setAuthError("New passcode must be at least 4 characters.");
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthError("");
      const db = getDb();
      if (!db) throw new Error("Database service unavailable.");

      const targetSnap = await db.collection("vaults").doc(nPin).get();
      if (targetSnap.exists && nPin !== inputPin.trim()) {
        setAuthError("New passcode is already taken by another vault.");
        setIsAuthenticating(false);
        return;
      }

      const oldSnap = await db.collection("vaults").doc(inputPin.trim()).get();
      if (oldSnap.exists) {
        const oldData = oldSnap.data();
        await db.collection("vaults").doc(nPin).set({
          ...oldData,
          pin: nPin,
          lastModified: new Date().toISOString()
        });
        
        setActivePin(nPin);
        localStorage.setItem("pocketpulse_active_pin", nPin);
        setAuthMode("login");
        setNewPin("");
        setInputSec("");
        setInputPin("");
        triggerToast("Passcode Successfully Updated", "success");
      }
    } catch (err) {
      setAuthError("Reset failed: " + err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("pocketpulse_logged_in");
    setAuthMode("login");
    setInputPin("");
    setInputSec("");
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      alert("Please specify the purpose and amount.");
      return;
    }
    const item = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      isoDate: formatToISODate(new Date()),
      timestamp: getLiveTimestamp()
    };
    const updated = [...data];
    updated[currentIdx].expenses.unshift(item);
    updateDataBoth(updated);
    setTitle("");
    setAmount("");
    triggerToast(`Logged Outflow: ₹${Number(amount).toLocaleString('en-IN')}`, "outflow");
  };

  const handleDeleteExpense = (id) => {
    const updated = [...data];
    updated[currentIdx].expenses = updated[currentIdx].expenses.filter(item => item.id !== id);
    updateDataBoth(updated);
    triggerToast("Transaction Removed", "neutral");
  };

  const handleAddFunds = (e) => {
    e.preventDefault();
    const addedAmount = Number(fundAmount);
    if (!addedAmount || addedAmount <= 0) {
      alert("Please enter a valid amount to add.");
      return;
    }
    const recordSource = fundSource.trim() || "Manual Pocket Top-up";

    const newInflowRecord = {
      id: Date.now(),
      source: recordSource,
      amount: addedAmount,
      isoDate: formatToISODate(new Date()),
      timestamp: getLiveTimestamp()
    };

    const updated = [...data];
    updated[currentIdx].budget = Number(updated[currentIdx].budget) + addedAmount;
    if (!updated[currentIdx].inflowHistory) {
      updated[currentIdx].inflowHistory = [];
    }
    updated[currentIdx].inflowHistory.unshift(newInflowRecord);

    updateDataBoth(updated);
    setFundAmount("");
    setFundSource("");
    triggerToast(`Credited: +₹${addedAmount.toLocaleString('en-IN')} to ${activeMonth.month}`, "success");
  };

  const handleDeleteFundRecord = (id, recAmount) => {
    const updated = [...data];
    updated[currentIdx].inflowHistory = updated[currentIdx].inflowHistory.filter(r => r.id !== id);
    updated[currentIdx].budget = Math.max(0, Number(updated[currentIdx].budget) - Number(recAmount));
    updateDataBoth(updated);
    triggerToast("Inflow Record Removed", "neutral");
  };

  const maxGraphValue = Math.max(
    ...data.map(m => Math.max(m.budget, m.expenses.reduce((s, e) => s + Number(e.amount), 0))),
    1000
  );

  const inspectedMonth = data[selectedAnalyticsIdx] || data[0];
  const inspectedSpent = inspectedMonth.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const inspectedRemaining = inspectedMonth.budget - inspectedSpent;
  const inspectedDiscipline = calculateDiscipline(inspectedSpent, inspectedMonth.budget);
  const inspectedSavingsRate = inspectedMonth.budget > 0 
    ? Math.max(0, Math.round((inspectedRemaining / inspectedMonth.budget) * 100))
    : 0;
  const inspectedSpentRate = inspectedMonth.budget > 0 
    ? Math.min(100, Math.round((inspectedSpent / inspectedMonth.budget) * 100))
    : (inspectedSpent > 0 ? 100 : 0);

  const circumference = 2 * Math.PI * 38;
  const strokeSpentLength = (inspectedSpentRate / 100) * circumference;

  // 1. SPLASH SCREEN
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#050811] flex flex-col items-center justify-center z-50 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-28 h-28 bg-cyan-500/20 rounded-full animate-ping"></div>
          <div className="absolute w-36 h-36 bg-indigo-500/10 rounded-full animate-pulse"></div>
          
          <div className="relative w-20 h-20 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-3xl p-0.5 shadow-2xl shadow-cyan-500/50 flex items-center justify-center">
            <div className="w-full h-full bg-[#070b14] rounded-[22px] flex items-center justify-center">
              <BarChart3 className="text-cyan-400 animate-pulse" size={36} />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">
          PocketPulse
        </h1>
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-1 font-semibold">
          Offline-First Financial Ledger
        </p>

        <div className="w-48 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full animate-pulse"></div>
        </div>
        <span className="text-[10px] text-gray-500 mt-2 font-mono">Securing Cloud & Local Storage...</span>
      </div>
    );
  }

  // 2. PROFESSIONAL FINTECH LOGIN BOARD
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-gray-900/90 border border-cyan-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-2xl relative z-10">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-950">
                <Wallet className="text-cyan-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                  PocketPulse
                </h2>
                <span className="text-[10px] text-cyan-400/80 font-mono tracking-wider uppercase font-semibold flex items-center gap-1">
                  <Sparkles size={10} /> Cloud Vault Security
                </span>
              </div>
            </div>

            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
              isOnline ? "border-emerald-500/40 text-emerald-400 bg-emerald-950/40" : "border-rose-500/40 text-rose-400 bg-rose-950/40"
            }`}>
              {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
              {isOnline ? "Live" : "Offline"}
            </div>
          </div>

          {(authMode === "login" || authMode === "setup") && (
            <div className="grid grid-cols-2 bg-black/50 p-1 rounded-2xl border border-gray-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "login"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Access Vault
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("setup");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "setup"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                New Vault
              </button>
            </div>
          )}

          {authError && (
            <div className="text-xs p-3 rounded-xl mb-4 text-center font-medium bg-rose-950/80 border border-rose-500/60 text-rose-300">
              {authError}
            </div>
          )}

          {authMode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-300 font-bold flex items-center gap-1">
                    <KeyRound size={13} className="text-cyan-400" /> Vault Passcode
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot");
                      setAuthError("");
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Forgot passcode?
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type={showPinText ? "text" : "password"}
                    placeholder="Enter your confidential passcode"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinText(!showPinText)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPinText ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl transition shadow-lg shadow-cyan-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isAuthenticating ? "Verifying..." : "Unlock & Synchronize"}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {authMode === "setup" && (
            <form onSubmit={handleSetupPin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1.5 flex items-center gap-1">
                  <KeyRound size={13} className="text-cyan-400" /> Create Unique Passcode
                </label>
                <div className="relative">
                  <input 
                    type={showPinText ? "text" : "password"}
                    placeholder="Min. 4 characters (e.g., 9494, pulse#1)"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinText(!showPinText)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPinText ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1.5 flex items-center gap-1">
                  <HelpCircle size={13} className="text-cyan-400" /> Recovery Secret Key
                </label>
                <input 
                  type="text"
                  placeholder="Security keyword (for password reset)"
                  value={inputSec}
                  onChange={(e) => setInputSec(e.target.value)}
                  className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-black font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isAuthenticating ? "Checking Uniqueness..." : "Establish Unique Vault"}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {authMode === "forgot" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-sm font-bold text-white">Vault Recovery</h3>
                <p className="text-[11px] text-gray-400">Authenticate identity using recovery secret key</p>
              </div>

              <form onSubmit={handleForgotVerify} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Target Passcode to Recover</label>
                  <input 
                    type="text"
                    placeholder="Enter registered passcode"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">Recovery Secret Key</label>
                  <input 
                    type="text"
                    placeholder="Enter recovery keyword"
                    value={inputSec}
                    onChange={(e) => setInputSec(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <span>{isAuthenticating ? "Authenticating..." : "Authorize Identity"}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-white pt-2 transition"
                >
                  Cancel & Return to Login
                </button>
              </form>
            </div>
          )}

          {authMode === "reset" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-sm font-bold text-white">Set New Passcode</h3>
                <p className="text-[11px] text-gray-400">Configure a fresh unique access key</p>
              </div>

              <form onSubmit={handleResetPin} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">New Confidential Passcode</label>
                  <input 
                    type="password"
                    placeholder="Enter new 4+ character passcode"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <span>{isAuthenticating ? "Applying..." : "Update Passcode & Login"}</span>
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-800/80 text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Encrypted Multi-Device Firestore Synchronizer</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN DASHBOARD INTERFACE
  return (
    <div className="min-h-screen bg-[#070b14] text-white p-3 sm:p-6 pb-24 sm:pb-6 font-sans relative">
      
      {toast.show && (
        <div className="fixed top-5 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-300 transform animate-bounce">
          <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl border font-bold text-xs sm:text-sm tracking-wide ${
            toast.type === "success" 
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50" 
              : toast.type === "outflow"
              ? "bg-cyan-950/90 border-cyan-500/50 text-cyan-300 shadow-cyan-950/50"
              : "bg-gray-900/90 border-gray-700 text-gray-300"
          }`}>
            <CheckCircle2 size={16} className={toast.type === "success" ? "text-emerald-400" : "text-cyan-400"} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <header className="max-w-4xl mx-auto flex flex-wrap justify-between items-center pb-4 border-b border-gray-800 gap-3">
        <div>
          <h1 className="text-xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Wallet className="text-cyan-400" size={24} /> PocketPulse
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-400">Offline-First Personal Financial Ledger (₹ INR)</p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            isOnline 
              ? "bg-emerald-950/70 border-emerald-500 text-emerald-300" 
              : "bg-rose-950/90 border-rose-500 text-rose-300 shadow-md shadow-rose-950"
          }`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} className="animate-pulse text-rose-400" />}
            <span>{isOnline ? "Online Sync" : "Offline Storage Active"}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-950 to-indigo-950 border border-cyan-500/40 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold">
            <UserCheck className="text-cyan-400" size={14} />
            <span className="text-cyan-300">{currentDiscipline.score}/100</span>
          </div>

          <button 
            onClick={handleLogout}
            title="Lock Ledger"
            className="p-1.5 sm:p-2 bg-gray-900 border border-gray-800 hover:border-rose-500 hover:text-rose-400 rounded-full transition text-gray-400"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <nav className="hidden sm:flex max-w-4xl mx-auto mt-5 gap-2 border-b border-gray-800 pb-3">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === "dashboard" 
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
              : "text-gray-400 hover:text-white hover:bg-gray-900"
          }`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </button>

        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === "analytics" 
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
              : "text-gray-400 hover:text-white hover:bg-gray-900"
          }`}
        >
          <BarChart3 size={16} /> Trends & Audit
        </button>

        <button 
          onClick={() => setActiveTab("budget")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === "budget" 
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
              : "text-gray-400 hover:text-white hover:bg-gray-900"
          }`}
        >
          <ArrowDownLeft size={16} /> Add Funds
        </button>
      </nav>

      <main className="max-w-4xl mx-auto mt-4 sm:mt-6">
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-center bg-gray-900/80 border border-cyan-900/50 p-2.5 sm:p-3 rounded-2xl">
              <button 
                disabled={currentIdx === 0} 
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="p-2 bg-gray-800 hover:bg-cyan-900/50 rounded-xl disabled:opacity-20 transition"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-cyan-300">
                <Calendar size={16} />
                <span>{activeMonth.month}</span>
              </div>

              <button 
                disabled={currentIdx === data.length - 1} 
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="p-2 bg-gray-800 hover:bg-cyan-900/50 rounded-xl disabled:opacity-20 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-gray-900 to-indigo-950/80 border border-indigo-500/30 p-4 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] sm:text-xs font-bold text-indigo-300 uppercase">Total Pocket Funds</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                    {activeMonth.inflowHistory ? activeMonth.inflowHistory.length : 0} logs
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  ₹ {activeMonth.budget.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {activeMonth.budget === 0 ? "No funds added yet" : "Accumulated pocket funds"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-cyan-950/80 border border-cyan-500/30 p-4 rounded-2xl shadow-lg">
                <div className="flex justify-between text-[11px] sm:text-xs font-bold text-cyan-300 uppercase">
                  <span>Total Spent ({spentPercent}%)</span>
                  <span>₹ {totalSpent.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-800 h-2.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      spentPercent > 80 ? "bg-rose-500" : "bg-gradient-to-r from-cyan-400 to-indigo-500"
                    }`}
                    style={{ width: `${spentPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-gray-400 mt-2 flex justify-between">
                  <span>Available Balance:</span>
                  <span className={`font-bold ${remaining < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    ₹ {remaining.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-purple-950/80 border border-purple-500/40 p-4 rounded-2xl shadow-lg flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-purple-300 text-[11px] sm:text-xs font-bold uppercase">
                  <Calculator size={14} /> Daily Average Outflow
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  ₹ {dailyAverageSpend.toLocaleString('en-IN')}
                  <span className="text-xs text-gray-400 font-normal"> / active day</span>
                </div>
                <div className="text-[10px] text-purple-400 font-semibold mt-1">
                  Calculated across {distinctDaysCount} active spend day(s)
                </div>
              </div>
            </div>

            <form onSubmit={handleAddExpense} className="bg-gray-900/80 border border-gray-800 p-3 sm:p-4 rounded-2xl flex flex-wrap gap-2.5 items-center">
              <input 
                type="text" 
                placeholder="What did you spend on? (e.g., Petrol, Canteen, Books)" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 min-w-[170px] bg-black/60 border border-gray-700 rounded-xl px-3 sm:px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">₹</span>
                <input 
                  type="number" 
                  placeholder="Amount" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-28 pl-7 pr-2 bg-black/60 border border-gray-700 rounded-xl py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold px-5 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg shadow-cyan-500/20"
              >
                <PlusCircle size={16} /> Record Transaction
              </button>
            </form>

            <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-2xl space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider">
                  Outflow Transactions ({filteredExpenses.length})
                </h2>
                
                <div className="relative w-full sm:w-56">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input 
                    type="text"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-black/50 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/80">
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 mr-1">
                  <Filter size={13} className="text-cyan-400" /> Filter Date:
                </div>

                <button 
                  onClick={() => setDateFilterMode("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    dateFilterMode === "all" 
                      ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                      : "bg-black/40 text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  All Days
                </button>

                <button 
                  onClick={() => setDateFilterMode("today")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    dateFilterMode === "today" 
                      ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                      : "bg-black/40 text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  Today
                </button>

                <button 
                  onClick={() => setDateFilterMode("yesterday")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    dateFilterMode === "yesterday" 
                      ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                      : "bg-black/40 text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  Yesterday
                </button>

                <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-black/40 border border-gray-800 rounded-lg px-2 py-0.5">
                  <span className="text-[10px] text-gray-400">Pick Date:</span>
                  <input 
                    type="date"
                    value={customFilterDate}
                    onChange={(e) => {
                      setCustomFilterDate(e.target.value);
                      setDateFilterMode("custom");
                    }}
                    className="bg-transparent text-xs text-cyan-300 focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">
                    {searchQuery 
                      ? "No matching expenses found." 
                      : dateFilterMode === "today"
                      ? "No transactions logged for Today."
                      : dateFilterMode === "yesterday"
                      ? "No transactions logged for Yesterday."
                      : dateFilterMode === "custom"
                      ? `No transactions recorded on ${customFilterDate}.`
                      : "No transactions logged for this cycle yet."}
                  </div>
                ) : (
                  filteredExpenses.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-black/40 border border-gray-800/80 rounded-xl hover:border-gray-700 transition">
                      <div>
                        <div className="font-semibold text-xs sm:text-sm text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} className="text-cyan-400" />
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xs sm:text-sm text-cyan-300 whitespace-nowrap">₹ {item.amount.toLocaleString('en-IN')}</span>
                        <button onClick={() => handleDeleteExpense(item.id)} className="text-gray-500 hover:text-rose-400 transition p-1">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl space-y-6">
              
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <BarChart3 className="text-cyan-400" size={18} /> Budget vs. Outflow Comparison
                  </h3>
                  <p className="text-xs text-gray-400">Click any month below to inspect details, scores, and balance.</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-indigo-500/50 border border-indigo-400"></span>
                    <span className="text-indigo-300">Total Funds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-cyan-500 to-teal-300"></span>
                    <span className="text-cyan-300">Spent</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-2xl p-4 sm:p-6 pt-10">
                <div className="grid grid-flow-col auto-cols-fr gap-3 sm:gap-4 items-end h-56 border-b border-gray-800 pb-2 overflow-x-auto">
                  {data.map((m, idx) => {
                    const spent = m.expenses.reduce((s, e) => s + Number(e.amount), 0);
                    const budgetHeight = Math.max(8, Math.round((m.budget / maxGraphValue) * 100));
                    const spentHeight = Math.max(8, Math.round((spent / maxGraphValue) * 100));
                    const isSelected = idx === selectedAnalyticsIdx;

                    return (
                      <div 
                        key={m.month}
                        onClick={() => setSelectedAnalyticsIdx(idx)}
                        className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-2 rounded-xl group ${
                          isSelected ? "bg-cyan-950/40 border border-cyan-500/50 shadow-lg" : "hover:bg-gray-800/40"
                        }`}
                      >
                        <div className="flex gap-1.5 text-[9px] sm:text-[10px] font-bold mb-2">
                          <span className="text-indigo-300">₹{m.budget}</span>
                          <span className="text-cyan-400">₹{spent}</span>
                        </div>

                        <div className="flex items-end gap-1 sm:gap-1.5 h-36 w-full justify-center">
                          <div 
                            className="w-4 sm:w-7 bg-indigo-950/80 border border-indigo-500/40 rounded-t-lg transition-all duration-500"
                            style={{ height: `${budgetHeight}%` }}
                          ></div>
                          <div 
                            className={`w-4 sm:w-7 rounded-t-lg transition-all duration-500 ${
                              (spent > m.budget && m.budget > 0) ? "bg-rose-500 shadow-rose-500/30" : "bg-gradient-to-t from-cyan-500 to-teal-300"
                            }`}
                            style={{ height: `${spentHeight}%` }}
                          ></div>
                        </div>

                        <span className={`text-[11px] sm:text-xs font-bold mt-3 text-center ${
                          isSelected ? "text-cyan-300 font-extrabold" : "text-gray-400"
                        }`}>
                          {m.month.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {isSelected ? "● Selected" : "Click"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-cyan-950/60 border border-cyan-500/40 p-4 sm:p-6 rounded-3xl shadow-xl space-y-5">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-gray-800 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider">Cycle Audit</span>
                    <h4 className="text-lg sm:text-2xl font-black text-white">{inspectedMonth.month}</h4>
                  </div>
                  <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
                    <UserCheck size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white">Discipline:</span>
                    <span className="text-xs font-black text-cyan-300">{inspectedDiscipline.score}/100</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">({inspectedDiscipline.grade})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Total Inflow</div>
                    <div className="text-base sm:text-xl font-black text-indigo-300 mt-0.5">
                      ₹ {inspectedMonth.budget.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Total Outflow</div>
                    <div className="text-base sm:text-xl font-black text-cyan-400 mt-0.5">
                      ₹ {inspectedSpent.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Savings / Balance</div>
                    <div className={`text-base sm:text-xl font-black mt-0.5 ${
                      inspectedRemaining < 0 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      ₹ {inspectedRemaining.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">Savings Ratio</div>
                    <div className="text-base sm:text-xl font-black text-yellow-300 mt-0.5">
                      {inspectedSavingsRate}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-black/40 border border-gray-800/80 rounded-2xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2 uppercase">
                      <ArrowDownLeft size={15} /> Funds Added History
                    </div>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {(!inspectedMonth.inflowHistory || inspectedMonth.inflowHistory.length === 0) ? (
                        <div className="text-[11px] text-gray-500 py-3 text-center">No funds added for this cycle.</div>
                      ) : (
                        inspectedMonth.inflowHistory.map(r => (
                          <div key={r.id} className="flex justify-between items-center p-2 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-xs">
                            <div>
                              <span className="text-gray-200 font-medium">{r.source}</span>
                              <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                <Clock size={10} className="text-emerald-400" />
                                <span>{r.timestamp}</span>
                              </div>
                            </div>
                            <span className="text-emerald-400 font-bold">+₹{r.amount.toLocaleString('en-IN')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-gray-800/80 rounded-2xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 mb-2 uppercase">
                      <ArrowUpRight size={15} /> Outflow Expenses Log
                    </div>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {inspectedMonth.expenses.length === 0 ? (
                        <div className="text-[11px] text-gray-500 py-3 text-center">No expense logs recorded.</div>
                      ) : (
                        inspectedMonth.expenses.map(e => (
                          <div key={e.id} className="flex justify-between items-center p-2 bg-black/50 border border-gray-800 rounded-lg text-xs">
                            <div>
                              <span className="text-gray-300 truncate mr-2 block">{e.title}</span>
                              <span className="text-[10px] text-gray-500">{e.timestamp}</span>
                            </div>
                            <span className="text-cyan-300 font-bold whitespace-nowrap">-₹{e.amount.toLocaleString('en-IN')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

              <div className="bg-black/50 border border-gray-800/80 p-5 rounded-3xl pt-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 mb-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm sm:text-base">
                    <PieIcon size={18} /> Cycle Distribution (Pie Breakdown)
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">
                    Target: {inspectedMonth.month}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                      <circle cx="50" cy="50" r="38" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset="0" className="transition-all duration-700" />
                      <circle cx="50" cy="50" r="38" stroke="#06b6d4" strokeWidth="12" fill="transparent" strokeDasharray={`${strokeSpentLength} ${circumference}`} strokeDashoffset="0" className="transition-all duration-700" />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-gray-400 uppercase text-[9px]">Spent</span>
                      <span className="text-lg font-black text-cyan-300 leading-tight">
                        {inspectedSpentRate}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 w-full sm:w-auto">
                    <div className="flex items-center justify-between gap-6 p-2.5 bg-black/40 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                        <span className="text-xs font-semibold text-gray-300">Outflow Spent</span>
                      </div>
                      <span className="text-xs font-black text-cyan-300">
                        ₹{inspectedSpent.toLocaleString('en-IN')} ({inspectedSpentRate}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-6 p-2.5 bg-black/40 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-semibold text-gray-300">Reserve Balance</span>
                      </div>
                      <span className="text-xs font-black text-emerald-400">
                        ₹{inspectedRemaining > 0 ? inspectedRemaining.toLocaleString('en-IN') : 0} ({inspectedSavingsRate}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "budget" && (
          <div className="space-y-4 sm:space-y-6 max-w-xl mx-auto">
            <div className="flex justify-between items-center bg-gray-900/80 border border-cyan-900/50 p-2.5 sm:p-3 rounded-2xl">
              <button 
                disabled={currentIdx === 0} 
                onClick={() => setCurrentIdx(prev => prev - 1)}
                className="p-2 bg-gray-800 hover:bg-cyan-900/50 rounded-xl disabled:opacity-20 transition"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-cyan-300">
                <Calendar size={16} />
                <span>{activeMonth.month}</span>
              </div>

              <button 
                disabled={currentIdx === data.length - 1} 
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="p-2 bg-gray-800 hover:bg-cyan-900/50 rounded-xl disabled:opacity-20 transition"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="bg-gray-900/90 border border-cyan-500/30 p-5 sm:p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 font-black text-base sm:text-lg mb-1">
                <ArrowDownLeft size={20} /> Manual Funds Inflow (Top-up)
              </div>
              <p className="text-xs text-gray-400 mb-5">
                Add pocket money directly to: <span className="text-cyan-300 font-bold">{activeMonth.month}</span>
              </p>

              <form onSubmit={handleAddFunds} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-gray-400 font-bold">₹</span>
                    <input 
                      type="number"
                      placeholder="Amount to add (e.g., 2000)"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white font-bold focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>

                  <input 
                    type="text"
                    placeholder="Source (e.g., Dad sent, Freelance)"
                    value={fundSource}
                    onChange={(e) => setFundSource(e.target.value)}
                    className="w-full px-4 py-3 bg-black/60 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold rounded-xl transition shadow-lg shadow-cyan-500/20 text-sm flex items-center justify-center gap-1.5"
                >
                  <PlusCircle size={16} /> Record Funds Inflow
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Manual Inflow History ({activeMonth.month})
                  </h3>
                  <span className="text-xs font-bold text-emerald-400">
                    Total Funds: ₹{activeMonth.budget.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(!activeMonth.inflowHistory || activeMonth.inflowHistory.length === 0) ? (
                    <p className="text-xs text-gray-500 text-center py-4">No funds recorded for {activeMonth.month}. Add funds above.</p>
                  ) : (
                    activeMonth.inflowHistory.map(rec => (
                      <div key={rec.id} className="flex justify-between items-center p-3 bg-black/40 border border-gray-800 rounded-xl hover:border-gray-700 transition">
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-white">{rec.source}</div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock size={10} className="text-emerald-400" />
                            <span>{rec.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-emerald-400">+₹{rec.amount.toLocaleString('en-IN')}</span>
                          <button 
                            onClick={() => handleDeleteFundRecord(rec.id, rec.amount)}
                            className="text-gray-600 hover:text-rose-400 transition p-1"
                            title="Delete entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-950/95 border-t border-gray-800 px-6 py-2.5 flex justify-between items-center backdrop-blur-lg z-50">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 ${activeTab === "dashboard" ? "text-cyan-400 font-bold" : "text-gray-500"}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 ${activeTab === "analytics" ? "text-cyan-400 font-bold" : "text-gray-500"}`}
        >
          <BarChart3 size={20} />
          <span className="text-[10px]">Audit</span>
        </button>

        <button 
          onClick={() => setActiveTab("budget")}
          className={`flex items-center flex-col gap-1 ${activeTab === "budget" ? "text-cyan-400 font-bold" : "text-gray-500"}`}
        >
          <ArrowDownLeft size={20} />
          <span className="text-[10px]">Funds</span>
        </button>
      </div>
    </div>
  );
}
