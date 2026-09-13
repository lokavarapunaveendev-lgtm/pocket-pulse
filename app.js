import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSqQ0_tBbL_VhgNK5PjEnhh5_E-_K2YIk",
  authDomain: "pocket-pulse-607bc.firebaseapp.com",
  projectId: "pocket-pulse-607bc",
  storageBucket: "pocket-pulse-607bc.firebasestorage.app",
  messagingSenderId: "443533839623",
  appId: "1:443533839623:web:db473c0fc09264b52e09a2",
  measurementId: "G-RG7TFM5D5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
let unsubscribeSync = null;

// Track Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("app-section").classList.remove("hidden");
    document.getElementById("user-display").innerText = user.email;
    listenForDataUpdates(user.uid);
  } else {
    currentUser = null;
    if (unsubscribeSync) unsubscribeSync();
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("app-section").classList.add("hidden");
  }
});

// Sign Up (Prevents Duplicate Accounts)
window.handleSignup = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("auth-error");
  errorEl.innerText = "";

  if (!email || !password) {
    errorEl.innerText = "Please enter both email and password.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errorEl.innerText = err.message;
  }
};

// Login
window.handleLogin = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorEl = document.getElementById("auth-error");
  errorEl.innerText = "";

  if (!email || !password) {
    errorEl.innerText = "Please enter both email and password.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    errorEl.innerText = err.message;
  }
};

// Logout
window.handleLogout = async () => {
  await signOut(auth);
};

// Save Data to Firestore Cloud Database
window.saveData = async () => {
  if (!currentUser) return;
  const title = document.getElementById("entry-title").value.trim();
  const amount = document.getElementById("entry-amount").value.trim();

  if (!title || !amount) return;

  try {
    await addDoc(collection(db, "records"), {
      userId: currentUser.uid,
      title: title,
      amount: amount,
      createdAt: new Date().toISOString()
    });

    document.getElementById("entry-title").value = "";
    document.getElementById("entry-amount").value = "";
  } catch (err) {
    console.error("Error saving data:", err);
  }
};

// Real-time Cloud Sync across Devices
function listenForDataUpdates(userId) {
  const q = query(collection(db, "records"), where("userId", "==", userId));

  unsubscribeSync = onSnapshot(q, (snapshot) => {
    const listEl = document.getElementById("data-list");
    listEl.innerHTML = "";

    if (snapshot.empty) {
      listEl.innerHTML = '<p style="color: #6b7280; font-size: 14px;">No records found.</p>';
      return;
    }

    snapshot.forEach((doc) => {
      const item = doc.data();
      const row = document.createElement("div");
      row.className = "item-row";
      row.innerHTML = `
        <span class="item-title">${item.title}</span>
        <span class="item-amount">₹${item.amount}</span>
      `;
      listEl.appendChild(row);
    });
  });
}
