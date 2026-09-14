import React, { useState, useEffect } from 'react';
import { 
  Calendar, PlusCircle, Wifi, WifiOff, 
  ChevronLeft, ChevronRight, Trash2, LayoutDashboard, 
  BarChart3, LogOut, ShieldCheck, UserCheck, 
  Search, ArrowDownLeft, ArrowUpRight,
  Clock, CheckCircle2, Filter,
  Eye, EyeOff, KeyRound, HelpCircle, Sparkles, ArrowRight, Globe,
  TrendingDown, TrendingUp
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

// Custom 3D Frosted Glassmorphism Shield & Vibe Wave Logo Component
const FinVibeLogo = ({ size = 36, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="shieldBg" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#0f172a" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.25" />
      </linearGradient>
      <linearGradient id="waveGrad" x1="20" y1="50" x2="80" y2="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
      <linearGradient id="shieldBorder" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#34d399" stopOpacity="0.9" />
      </linearGradient>
      <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Squircle / Outer Container */}
    <rect x="8" y="8" width="84" height="84" rx="24" fill="#070b14" stroke="#1e293b" strokeWidth="2" />

    {/* 3D Glassmorphic Shield */}
    <path 
      d="M50 16 C68 16, 78 24, 78 38 C78 62, 50 82, 50 82 C50 82, 22 62, 22 38 C22 24, 32 16, 50 16 Z" 
      fill="url(#shieldBg)" 
      stroke="url(#shieldBorder)" 
      strokeWidth="2.5" 
      backdropFilter="blur(8px)"
    />

    {/* Glowing Audio Vibe / Financial Waveform with Currency Arc */}
    <g filter="url(#neonGlow)">
      {/* Dynamic Soundwave Bars */}
      <line x1="32" y1="43" x2="32" y2="53" stroke="url(#waveGrad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="35" x2="40" y2="61" stroke="url(#waveGrad)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="48" y1="28" x2="48" y2="67" stroke="url(#waveGrad)" strokeWidth="4" strokeLinecap="round" />
      <line x1="56" y1="36" x2="56" y2="59" stroke="url(#waveGrad)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="64" y1="42" x2="64" y2="54" stroke="url(#waveGrad)" strokeWidth="3" strokeLinecap="round" />

      {/* Modern Trending Currency Loop Curve */}
      <path 
        d="M28 54 Q 38 32, 50 48 T 72 38" 
        stroke="#67e8f9" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        fill="none" 
      />
    </g>
  </svg>
);

// 10 Indian Languages Dictionary
const TRANSLATIONS = {
  en: {
    appName: "FinVibe",
    tagline: "Smart Real-time Financial Ledger (₹ INR)",
    live: "Live Sync",
    offline: "Offline",
    dashboard: "Dashboard",
    analytics: "Trends & Audit",
    funds: "Add Funds",
    totalFunds: "Total Pocket Funds",
    logs: "logs",
    noFundsYet: "No funds added yet",
    accumulated: "Accumulated pocket funds",
    totalSpent: "Total Spent",
    availBalance: "Available Balance:",
    recordTxn: "Record Outflow",
    expensePlaceholder: "Where did you spend? (e.g., Petrol, Food, Shopping)",
    amount: "Amount",
    outflows: "Outflow History",
    search: "Search expenses...",
    filterDate: "Filter Date:",
    allDays: "All Days",
    today: "Today",
    yesterday: "Yesterday",
    pickDate: "Pick Date:",
    noExpenses: "No transactions recorded.",
    comparison: "Budget vs. Outflow Comparison",
    clickInspect: "Click any month below to inspect details.",
    fundsLegend: "Total Funds",
    spentLegend: "Spent",
    cycleAudit: "Cycle Audit",
    discipline: "Discipline:",
    totalInflow: "Total Inflow",
    totalOutflow: "Total Outflow",
    savingsBal: "Savings / Balance",
    savingsRatio: "Savings Ratio",
    fundsAddedHist: "Funds Added History",
    expensesLog: "Outflow Expenses Log",
    noFundsCycle: "No funds added for this cycle.",
    noExpenseCycle: "No expense logs recorded.",
    manualInflow: "Add Pocket Funds",
    addMoneyTo: "Add funds directly to:",
    amountAdd: "Amount to add (₹)",
    sourcePlaceholder: "Source (e.g., Dad sent, Freelance, Salary)",
    recordInflowBtn: "Credit to Pocket",
    manualInflowHist: "Inflow History",
    accessVault: "Access Vault",
    newVault: "New Vault",
    vaultPasscode: "Vault Passcode",
    forgotPasscode: "Forgot passcode?",
    unlockBtn: "Unlock & Synchronize",
    createPasscode: "Create Unique Passcode",
    recoveryKey: "Recovery Secret Key",
    recoveryPlaceholder: "Security keyword (for password reset)",
    establishVaultBtn: "Establish Unique Vault",
    vaultRecovery: "Vault Recovery",
    recoverInstruction: "Authenticate identity using recovery secret key",
    targetPasscode: "Target Passcode to Recover",
    authorizeBtn: "Authorize Identity",
    cancelBtn: "Cancel & Return to Login",
    setNewPasscode: "Set New Passcode",
    freshKeyInstruction: "Configure a fresh unique access key",
    newPasscodeLabel: "New Confidential Passcode",
    updateLoginBtn: "Update Passcode & Login",
    logOutflowTitle: "Quick Outflow Entry",
    creditFundsTitle: "Pocket Inflow Top-up"
  },
  te: {
    appName: "FinVibe",
    tagline: "స్మార్ట్ రియల్‌టైమ్ ఫైనాన్షియల్ లెడ్జర్ (₹ INR)",
    live: "లైవ్ సింక్",
    offline: "ఆఫ్‌లైన్",
    dashboard: "డ్యాష్‌బోర్డ్",
    analytics: "ఆడిట్ & విశ్లేషణ",
    funds: "డబ్బులు చేర్చండి",
    totalFunds: "మొత్తం నిల్వ నిధులు",
    logs: "లాగ్‌లు",
    noFundsYet: "ఇంకా నిధులు చేర్చలేదు",
    accumulated: "జమ అయిన పాకెట్ నిధులు",
    totalSpent: "మొత్తం ఖర్చు",
    availBalance: "మిగిలిన బ్యాలెన్స్:",
    recordTxn: "ఖర్చు నమోదు చేయండి",
    expensePlaceholder: "ఎక్కడ ఖర్చు చేశారు? (ఉదా: పెట్రోల్, బిర్యానీ, మూవీ)",
    amount: "మొత్తం",
    outflows: "ఖర్చుల వివరాలు",
    search: "ఖర్చులను వెతకండి...",
    filterDate: "తేదీ ఫిల్టర్:",
    allDays: "అన్ని రోజులు",
    today: "ఈరోజు",
    yesterday: "నిన్న",
    pickDate: "తేదీ ఎంచుకోండి:",
    noExpenses: "ఖర్చులు ఏమీ నమోదు కాలేదు.",
    comparison: "బడ్జెట్ vs ఖర్చు పోలిక",
    clickInspect: "వివరాల కోసం ఏదైనా నెలను ఎంచుకోండి.",
    fundsLegend: "మొత్తం నిధులు",
    spentLegend: "ఖర్చు",
    cycleAudit: "నెలవారీ ఆడిట్",
    discipline: "క్రమశిక్షణ:",
    totalInflow: "మొత్తం రాబడి",
    totalOutflow: "మొత్తం ఖర్చు",
    savingsBal: "పొదుపు / బ్యాలెన్స్",
    savingsRatio: "పొదుపు శాతం",
    fundsAddedHist: "జమ చేసిన నిధుల చరిత్ర",
    expensesLog: "ఖర్చు చేసిన లాగ్‌లు",
    noFundsCycle: "ఈ నెలకు నిధులు జమ చేయలేదు.",
    noExpenseCycle: "ఖర్చుల రికార్డులు లేవు.",
    manualInflow: "పాకెట్ మనీ యాడ్ చేయండి",
    addMoneyTo: "డబ్బులు జమ చేయాల్సిన నెల:",
    amountAdd: "మొత్తం (₹)",
    sourcePlaceholder: "ఎవరిచ్చారు? (ఉదా: నాన్న పంపారు, జీతం, సేవింగ్స్)",
    recordInflowBtn: "ఖాతాలో జమ చేయండి",
    manualInflowHist: "జమ చేసిన నిధుల జాబితా",
    accessVault: "లాగిన్ అవ్వండి",
    newVault: "కొత్త వాల్ట్",
    vaultPasscode: "వాల్ట్ పాస్‌కోడ్",
    forgotPasscode: "పాస్‌కోడ్ మర్చిపోయారా?",
    unlockBtn: "అన్‌లాక్ & సింక్ చేయండి",
    createPasscode: "ప్రత్యేక పాస్‌కోడ్ సృష్టించండి",
    recoveryKey: "రికవరీ సీక్రెట్ కీవర్డ్",
    recoveryPlaceholder: "పాస్‌వర్డ్ రీసెట్ కొరకు కీవర్డ్",
    establishVaultBtn: "కొత్త ఖాతాను తెరవండి",
    vaultRecovery: "వాల్ట్ రికవరీ",
    recoverInstruction: "సీక్రెట్ కీవర్డ్ ద్వారా ధ్రువీకరించండి",
    targetPasscode: "రికవరీ చేయాల్సిన పాస్‌కోడ్",
    authorizeBtn: "ధ్రువీకరించండి",
    cancelBtn: "రద్దు చేసి లాగిన్‌కి వెళ్లండి",
    setNewPasscode: "కొత్త పాస్‌కోడ్ సెట్ చేయండి",
    freshKeyInstruction: "కొత్త యాక్సెస్ కీని ఎంటర్ చేయండి",
    newPasscodeLabel: "కొత్త పాస్‌కోడ్",
    updateLoginBtn: "పాస్‌కోడ్ మార్చి లాగిన్ అవ్వండి",
    logOutflowTitle: "త్వరిత ఖర్చు నమోదు",
    creditFundsTitle: "పాకెట్ నిధుల జమ"
  },
  hi: { appName: "FinVibe", dashboard: "डैशबोर्ड", funds: "फंड जोड़ें", analytics: "ट्रेंड्स और ऑडिट", recordTxn: "खर्च दर्ज करें", recordInflowBtn: "पॉकेट में जमा करें", totalFunds: "कुल फंड", totalSpent: "कुल खर्च", availBalance: "उपलब्ध शेष:" },
  kn: { appName: "FinVibe", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", funds: "ಹಣ ಸೇರಿಸಿ", analytics: "ವಿಶ್ಲೇಷಣೆ", recordTxn: "ಖರ್ಚು ದಾಖಲಿಸಿ", recordInflowBtn: "ಜಮೆ ಮಾಡಿ", totalFunds: "ಒಟ್ಟು ನಿಧಿ", totalSpent: "ಒಟ್ಟು ಖರ್ಚು", availBalance: "ಉಳಿದ ಹಣ:" },
  ml: { appName: "FinVibe", dashboard: "ഡാഷ്‌ബോർഡ്", funds: "പണം ചേർക്കുക", analytics: "വിശകലനം", recordTxn: "ചെലവ് രേഖപ്പെടുത്തുക", recordInflowBtn: "ചേർക്കുക", totalFunds: "ആകെ ഫണ്ട്", totalSpent: "ആകെ ചെലവ്", availBalance: "ബാക്കി തുക:" },
  ta: { appName: "FinVibe", dashboard: "முகப்பு", funds: "பணம் சேர்", analytics: "பகுப்பாய்வு", recordTxn: "செலவை பதிவு செய்", recordInflowBtn: "சேமி", totalFunds: "மொத்த இருப்பு", totalSpent: "மொத்த செலவு", availBalance: "மீதமுள்ள இருப்பு:" },
  mr: { appName: "FinVibe", dashboard: "डॅशबोर्ड", funds: "पैसे जोडा", analytics: "विश्लेषण", recordTxn: "खर्च नोंदवा", recordInflowBtn: "जमा करा", totalFunds: "एकूण निधी", totalSpent: "एकूण खर्च", availBalance: "शिल्लक:" },
  bn: { appName: "FinVibe", dashboard: "ড্যাশবোর্ড", funds: "টাকা যোগ করুন", analytics: "অডিট", recordTxn: "খরচ যোগ করুন", recordInflowBtn: "জমা করুন", totalFunds: "মোট ফান্ড", totalSpent: "মোট খরচ", availBalance: "অবশিষ্ট:" },
  gu: { appName: "FinVibe", dashboard: "ડેશબોર્ડ", funds: "રૂપિયા ઉમેરો", analytics: "વિશ્લેષણ", recordTxn: "ખર્ચ નોંધો", recordInflowBtn: "જમા કરો", totalFunds: "કુલ ફંડ", totalSpent: "કુલ ખર્ચ", availBalance: "બાકી રકમ:" },
  pa: { appName: "FinVibe", dashboard: "ਡੈਸ਼ਬੋਰਡ", funds: "ਫੰਡ ਜੋੜੋ", analytics: "ਵਿਸ਼ਲੇਸ਼ਣ", recordTxn: "ਖਰਚਾ ਦਰਜ ਕਰੋ", recordInflowBtn: "ਜਮ੍ਹਾਂ ਕਰੋ", totalFunds: "ਕੁੱਲ ਫੰਡ", totalSpent: "ਕੁੱਲ ਖਰਚ", availBalance: "ਬਾਕੀ:" }
};

const LANGUAGES_LIST = [
  { code: 'en', name: 'English' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
];

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

  const [lang, setLang] = useState(() => {
    return localStorage.getItem("finvibe_lang") || "en";
  });

  const t = { ...TRANSLATIONS.en, ...(TRANSLATIONS[lang] || {}) };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem("finvibe_lang", newLang);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1900);
    return () => clearTimeout(timer);
  }, []);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
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
    if (budget === 0 && spent > 0) return { score: 15, grade: "Grade C", percent: 100 };
    const percent = Math.min(100, Math.round((spent / budget) * 100));
    const score = Math.max(10, Math.min(100, Math.round(100 - (percent * 0.7))));
    const grade = score >= 80 ? "Grade A" : score >= 60 ? "Grade B" : "Grade C";
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
      triggerToast("FinVibe Vault Initialized & Synced", "success");
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
        triggerToast("FinVibe Synchronized", "success");
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
        triggerToast("Passcode Updated", "success");
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

  // Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      alert("Please specify purpose and amount.");
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
    triggerToast(`- ₹${Number(amount).toLocaleString('en-IN')} Logged`, "outflow");
  };

  const handleDeleteExpense = (id) => {
    const updated = [...data];
    updated[currentIdx].expenses = updated[currentIdx].expenses.filter(item => item.id !== id);
    updateDataBoth(updated);
    triggerToast("Removed", "neutral");
  };

  // Add Funds Inflow
  const handleAddFunds = (e) => {
    e.preventDefault();
    const addedAmount = Number(fundAmount);
    if (!addedAmount || addedAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    const recordSource = fundSource.trim() || "Pocket Money Top-up";

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
    triggerToast(`+ ₹${addedAmount.toLocaleString('en-IN')} Credited`, "success");
  };

  const handleDeleteFundRecord = (id, recAmount) => {
    const updated = [...data];
    updated[currentIdx].inflowHistory = updated[currentIdx].inflowHistory.filter(r => r.id !== id);
    updated[currentIdx].budget = Math.max(0, Number(updated[currentIdx].budget) - Number(recAmount));
    updateDataBoth(updated);
    triggerToast("Inflow Removed", "neutral");
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

  // 1. SPLASH SCREEN (Featuring FinVibe 3D Glassmorphism Shield + Vibe Wave)
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-[#040711] flex flex-col items-center justify-center z-50 select-none">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-32 h-32 bg-cyan-500/20 rounded-full animate-ping"></div>
          <div className="absolute w-44 h-44 bg-emerald-500/10 rounded-full animate-pulse"></div>
          
          <div className="relative z-10 drop-shadow-[0_0_25px_rgba(6,182,212,0.6)]">
            <FinVibeLogo size={88} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent tracking-tight">
          {t.appName}
        </h1>
        <p className="text-xs text-gray-400 tracking-widest uppercase mt-1 font-semibold">
          {t.tagline}
        </p>

        <div className="w-48 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATION BOARD
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050811] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-gray-900/90 border border-cyan-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl backdrop-blur-2xl relative z-10">
          
          {/* Language Selector */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-1.5 bg-black/60 border border-gray-700 px-3 py-1 rounded-xl">
              <Globe size={13} className="text-cyan-400" />
              <select 
                value={lang} 
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-transparent text-[11px] text-gray-300 font-semibold focus:outline-none cursor-pointer"
              >
                {LANGUAGES_LIST.map(l => (
                  <option key={l.code} value={l.code} className="bg-gray-900 text-white">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <div className="drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                <FinVibeLogo size={46} />
              </div>
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  {t.appName}
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
              {isOnline ? t.live : t.offline}
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
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-md shadow-cyan-500/20 font-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.accessVault}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("setup");
                  setAuthError("");
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authMode === "setup"
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black shadow-md shadow-cyan-500/20 font-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {t.newVault}
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
                    <KeyRound size={13} className="text-cyan-400" /> {t.vaultPasscode}
                  </label>
                  <button 
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot");
                      setAuthError("");
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                  >
                    {t.forgotPasscode}
                  </button>
                </div>
                
                <div className="relative">
                  <input 
                    type={showPinText ? "text" : "password"}
                    placeholder="••••••••"
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
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-extrabold rounded-xl transition shadow-lg shadow-cyan-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isAuthenticating ? "..." : t.unlockBtn}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {authMode === "setup" && (
            <form onSubmit={handleSetupPin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-300 font-bold block mb-1.5 flex items-center gap-1">
                  <KeyRound size={13} className="text-cyan-400" /> {t.createPasscode}
                </label>
                <div className="relative">
                  <input 
                    type={showPinText ? "text" : "password"}
                    placeholder="Min. 4 characters"
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
                  <HelpCircle size={13} className="text-cyan-400" /> {t.recoveryKey}
                </label>
                <input 
                  type="text"
                  placeholder={t.recoveryPlaceholder}
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
                <span>{isAuthenticating ? "..." : t.establishVaultBtn}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {authMode === "forgot" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-sm font-bold text-white">{t.vaultRecovery}</h3>
                <p className="text-[11px] text-gray-400">{t.recoverInstruction}</p>
              </div>

              <form onSubmit={handleForgotVerify} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">{t.targetPasscode}</label>
                  <input 
                    type="text"
                    placeholder="Passcode"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">{t.recoveryKey}</label>
                  <input 
                    type="text"
                    placeholder="Secret Key"
                    value={inputSec}
                    onChange={(e) => setInputSec(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-600 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <span>{isAuthenticating ? "..." : t.authorizeBtn}</span>
                </button>

                <button 
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-white pt-2 transition"
                >
                  {t.cancelBtn}
                </button>
              </form>
            </div>
          )}

          {authMode === "reset" && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="text-sm font-bold text-white">{t.setNewPasscode}</h3>
                <p className="text-[11px] text-gray-400">{t.freshKeyInstruction}</p>
              </div>

              <form onSubmit={handleResetPin} className="space-y-3">
                <div>
                  <label className="text-xs text-gray-300 font-bold block mb-1">{t.newPasscodeLabel}</label>
                  <input 
                    type="password"
                    placeholder="4+ characters"
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
                  <span>{isAuthenticating ? "..." : t.updateLoginBtn}</span>
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
              ? "bg-rose-950/90 border-rose-500/50 text-rose-300 shadow-rose-950/50"
              : "bg-gray-900/90 border-gray-700 text-gray-300"
          }`}>
            <CheckCircle2 size={16} className={toast.type === "success" ? "text-emerald-400" : "text-rose-400"} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Header with FinVibe 3D Logo */}
      <header className="max-w-4xl mx-auto flex flex-wrap justify-between items-center pb-4 border-b border-gray-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <FinVibeLogo size={42} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              {t.appName}
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-400">{t.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-700 px-2.5 py-1 rounded-full text-xs">
            <Globe size={13} className="text-cyan-400" />
            <select 
              value={lang} 
              onChange={(e) => handleLangChange(e.target.value)}
              className="bg-transparent text-[11px] text-gray-200 font-semibold focus:outline-none cursor-pointer"
            >
              {LANGUAGES_LIST.map(l => (
                <option key={l.code} value={l.code} className="bg-gray-900 text-white">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 border transition-all ${
            isOnline 
              ? "bg-emerald-950/70 border-emerald-500 text-emerald-300" 
              : "bg-rose-950/90 border-rose-500 text-rose-300 shadow-md shadow-rose-950"
          }`}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} className="animate-pulse text-rose-400" />}
            <span>{isOnline ? t.live : t.offline}</span>
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

      {/* Navigation Tabs */}
      <nav className="hidden sm:flex max-w-4xl mx-auto mt-5 gap-2 border-b border-gray-800 pb-3">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === "dashboard" 
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
              : "text-gray-400 hover:text-white hover:bg-gray-900"
          }`}
        >
          <LayoutDashboard size={16} /> {t.dashboard}
        </button>

        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === "analytics" 
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
              : "text-gray-400 hover:text-white hover:bg-gray-900"
          }`}
        >
          <BarChart3 size={16} /> {t.analytics}
        </button>

        <button 
          onClick={() => setActiveTab("budget")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition ${
            activeTab === "budget" 
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" 
              : "text-gray-400 hover:text-white hover:bg-gray-900"
          }`}
        >
          <ArrowDownLeft size={16} /> {t.funds}
        </button>
      </nav>

      {/* Main Dynamic View */}
      <main className="max-w-4xl mx-auto mt-4 sm:mt-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Calendar Cycle Bar */}
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

            {/* 2 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-gray-900 to-indigo-950/80 border border-indigo-500/30 p-4 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] sm:text-xs font-bold text-indigo-300 uppercase">{t.totalFunds}</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded-full">
                    {activeMonth.inflowHistory ? activeMonth.inflowHistory.length : 0} {t.logs}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  ₹ {activeMonth.budget.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {activeMonth.budget === 0 ? t.noFundsYet : t.accumulated}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-cyan-950/80 border border-cyan-500/30 p-4 rounded-2xl shadow-lg">
                <div className="flex justify-between text-[11px] sm:text-xs font-bold text-cyan-300 uppercase">
                  <span>{t.totalSpent} ({spentPercent}%)</span>
                  <span>₹ {totalSpent.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-gray-800 h-2.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      spentPercent > 80 ? "bg-rose-500" : "bg-gradient-to-r from-cyan-400 to-emerald-400"
                    }`}
                    style={{ width: `${spentPercent}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-gray-400 mt-2 flex justify-between">
                  <span>{t.availBalance}</span>
                  <span className={`font-bold ${remaining < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                    ₹ {remaining.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Outflow Log Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-cyan-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
              
              <div className="relative bg-gradient-to-br from-gray-900 via-[#0a0f1d] to-[#120815] border border-rose-500/40 p-4 sm:p-5 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-400">
                      <TrendingDown size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white tracking-wide uppercase">{t.logOutflowTitle}</h3>
                      <span className="text-[10px] text-rose-400/80 font-medium">Record daily outflows instantly</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 font-bold">
                    - Outflow
                  </span>
                </div>

                <form onSubmit={handleAddExpense} className="flex flex-wrap gap-2.5 items-center">
                  <div className="flex-1 min-w-[200px]">
                    <input 
                      type="text" 
                      placeholder={t.expensePlaceholder}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-black/80 border border-gray-700 hover:border-rose-500/50 focus:border-rose-400 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none transition shadow-inner"
                    />
                  </div>

                  <div className="relative w-full sm:w-36">
                    <span className="absolute left-3.5 top-3 text-rose-400 text-sm font-black">₹</span>
                    <input 
                      type="number" 
                      placeholder={t.amount} 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-3 bg-black/80 border border-gray-700 hover:border-rose-500/50 focus:border-rose-400 rounded-xl text-sm text-white font-bold placeholder-gray-500 focus:outline-none transition shadow-inner"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-white font-black text-sm rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle size={16} />
                    <span>{t.recordTxn}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Outflow History Section */}
            <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-2xl space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-gray-300 uppercase tracking-wider">
                  {t.outflows} ({filteredExpenses.length})
                </h2>
                
                <div className="relative w-full sm:w-56">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                  <input 
                    type="text"
                    placeholder={t.search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-black/50 border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Date Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-800/80">
                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 mr-1">
                  <Filter size={13} className="text-cyan-400" /> {t.filterDate}
                </div>

                <button 
                  onClick={() => setDateFilterMode("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    dateFilterMode === "all" 
                      ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                      : "bg-black/40 text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  {t.allDays}
                </button>

                <button 
                  onClick={() => setDateFilterMode("today")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    dateFilterMode === "today" 
                      ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                      : "bg-black/40 text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  {t.today}
                </button>

                <button 
                  onClick={() => setDateFilterMode("yesterday")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    dateFilterMode === "yesterday" 
                      ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50" 
                      : "bg-black/40 text-gray-400 hover:text-white border border-gray-800"
                  }`}
                >
                  {t.yesterday}
                </button>

                <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-black/40 border border-gray-800 rounded-lg px-2 py-0.5">
                  <span className="text-[10px] text-gray-400">{t.pickDate}</span>
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

              {/* Transactions List */}
              <div className="space-y-2 pt-1">
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-xs sm:text-sm">
                    {t.noExpenses}
                  </div>
                ) : (
                  filteredExpenses.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3.5 bg-gradient-to-r from-black/60 to-gray-900/60 border border-gray-800/90 rounded-2xl hover:border-rose-500/40 transition group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <TrendingDown size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{item.title}</div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                            <Clock size={10} className="text-rose-400" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm sm:text-base text-rose-400 whitespace-nowrap">
                          - ₹{item.amount.toLocaleString('en-IN')}
                        </span>
                        <button onClick={() => handleDeleteExpense(item.id)} className="text-gray-600 hover:text-rose-400 transition p-1 cursor-pointer">
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

        {/* TAB 2: TRENDS & AUDIT */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-gray-900/90 border border-gray-800 p-4 sm:p-6 rounded-3xl shadow-xl space-y-6">
              
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <BarChart3 className="text-cyan-400" size={18} /> {t.comparison}
                  </h3>
                  <p className="text-xs text-gray-400">{t.clickInspect}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-indigo-500/50 border border-indigo-400"></span>
                    <span className="text-indigo-300">{t.fundsLegend}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-cyan-500 to-emerald-400"></span>
                    <span className="text-emerald-300">{t.spentLegend}</span>
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
                              (spent > m.budget && m.budget > 0) ? "bg-rose-500 shadow-rose-500/30" : "bg-gradient-to-t from-cyan-500 to-emerald-400"
                            }`}
                            style={{ height: `${spentHeight}%` }}
                          ></div>
                        </div>

                        <span className={`text-[11px] sm:text-xs font-bold mt-3 text-center ${
                          isSelected ? "text-cyan-300 font-extrabold" : "text-gray-400"
                        }`}>
                          {m.month.split(" ")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Comprehensive Audit Card */}
              <div className="bg-gradient-to-br from-gray-900 to-cyan-950/60 border border-cyan-500/40 p-4 sm:p-6 rounded-3xl shadow-xl space-y-5">
                <div className="flex flex-wrap justify-between items-center pb-3 border-b border-gray-800 gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-black text-cyan-400 tracking-wider">{t.cycleAudit}</span>
                    <h4 className="text-lg sm:text-2xl font-black text-white">{inspectedMonth.month}</h4>
                  </div>
                  <div className="flex items-center gap-2 bg-black/60 border border-cyan-500/30 px-3 py-1.5 rounded-xl">
                    <UserCheck size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-white">{t.discipline}</span>
                    <span className="text-xs font-black text-cyan-300">{inspectedDiscipline.score}/100</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">({inspectedDiscipline.grade})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{t.totalInflow}</div>
                    <div className="text-base sm:text-xl font-black text-indigo-300 mt-0.5">
                      ₹ {inspectedMonth.budget.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{t.totalOutflow}</div>
                    <div className="text-base sm:text-xl font-black text-rose-400 mt-0.5">
                      ₹ {inspectedSpent.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{t.savingsBal}</div>
                    <div className={`text-base sm:text-xl font-black mt-0.5 ${
                      inspectedRemaining < 0 ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      ₹ {inspectedRemaining.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-gray-800">
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{t.savingsRatio}</div>
                    <div className="text-base sm:text-xl font-black text-yellow-300 mt-0.5">
                      {inspectedSavingsRate}%
                    </div>
                  </div>
                </div>

                {/* History Logs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-black/40 border border-gray-800/80 rounded-2xl p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2 uppercase">
                      <ArrowDownLeft size={15} /> {t.fundsAddedHist}
                    </div>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {(!inspectedMonth.inflowHistory || inspectedMonth.inflowHistory.length === 0) ? (
                        <div className="text-[11px] text-gray-500 py-3 text-center">{t.noFundsCycle}</div>
                      ) : (
                        inspectedMonth.inflowHistory.map(r => (
                          <div key={r.id} className="flex justify-between items-center p-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded-xl text-xs">
                            <div>
                              <span className="text-gray-200 font-semibold">{r.source}</span>
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
                      <ArrowUpRight size={15} /> {t.expensesLog}
                    </div>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {inspectedMonth.expenses.length === 0 ? (
                        <div className="text-[11px] text-gray-500 py-3 text-center">{t.noExpenseCycle}</div>
                      ) : (
                        inspectedMonth.expenses.map(e => (
                          <div key={e.id} className="flex justify-between items-center p-2.5 bg-black/50 border border-gray-800 rounded-xl text-xs">
                            <div>
                              <span className="text-gray-300 truncate mr-2 block font-medium">{e.title}</span>
                              <span className="text-[10px] text-gray-500">{e.timestamp}</span>
                            </div>
                            <span className="text-rose-400 font-bold whitespace-nowrap">-₹{e.amount.toLocaleString('en-IN')}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: ADD FUNDS */}
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

            {/* Inflow Card */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>

              <div className="relative bg-gradient-to-br from-gray-900 via-[#061510] to-[#041a13] border border-emerald-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded-xl text-emerald-400">
                      <TrendingUp size={20} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">{t.creditFundsTitle}</h3>
                      <p className="text-xs text-emerald-400/80 font-medium">
                        {t.addMoneyTo} <span className="font-bold text-white underline">{activeMonth.month}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
                    + Inflow
                  </span>
                </div>

                <form onSubmit={handleAddFunds} className="space-y-3.5 mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-emerald-400 font-black text-base">₹</span>
                      <input 
                        type="number"
                        placeholder={t.amountAdd}
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-black/80 border border-gray-700 hover:border-emerald-500/50 focus:border-emerald-400 rounded-xl text-white font-bold placeholder-gray-500 focus:outline-none text-sm transition shadow-inner"
                      />
                    </div>

                    <input 
                      type="text"
                      placeholder={t.sourcePlaceholder}
                      value={fundSource}
                      onChange={(e) => setFundSource(e.target.value)}
                      className="w-full px-4 py-3 bg-black/80 border border-gray-700 hover:border-emerald-500/50 focus:border-emerald-400 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none transition shadow-inner"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-black rounded-xl transition shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <PlusCircle size={18} />
                    <span>{t.recordInflowBtn}</span>
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-gray-800/80">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      {t.manualInflowHist}
                    </h3>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      Total: ₹{activeMonth.budget.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {(!activeMonth.inflowHistory || activeMonth.inflowHistory.length === 0) ? (
                      <p className="text-xs text-gray-500 text-center py-4">{t.noFundsCycle}</p>
                    ) : (
                      activeMonth.inflowHistory.map(rec => (
                        <div key={rec.id} className="flex justify-between items-center p-3 bg-black/50 border border-gray-800 rounded-xl hover:border-emerald-500/40 transition">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <TrendingUp size={15} />
                            </div>
                            <div>
                              <div className="font-bold text-xs sm:text-sm text-white">{rec.source}</div>
                              <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                                <Clock size={10} className="text-emerald-400" />
                                <span>{rec.timestamp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs sm:text-sm text-emerald-400">+₹{rec.amount.toLocaleString('en-IN')}</span>
                            <button 
                              onClick={() => handleDeleteFundRecord(rec.id, rec.amount)}
                              className="text-gray-600 hover:text-rose-400 transition p-1 cursor-pointer"
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

          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-950/95 border-t border-gray-800 px-6 py-2.5 flex justify-between items-center backdrop-blur-lg z-50">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-1 ${activeTab === "dashboard" ? "text-cyan-400 font-bold" : "text-gray-500"}`}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px]">{t.dashboard}</span>
        </button>

        <button 
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center gap-1 ${activeTab === "analytics" ? "text-cyan-400 font-bold" : "text-gray-500"}`}
        >
          <BarChart3 size={20} />
          <span className="text-[10px]">{t.analytics}</span>
        </button>

        <button 
          onClick={() => setActiveTab("budget")}
          className={`flex items-center flex-col gap-1 ${activeTab === "budget" ? "text-cyan-400 font-bold" : "text-gray-500"}`}
        >
          <ArrowDownLeft size={20} />
          <span className="text-[10px]">{t.funds}</span>
        </button>
      </div>
    </div>
  );
}
