// Import Firebase via módulo
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configuração do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABNpGsF0ckrYw63ysUC6jYAT-YnWd0xYk",
  authDomain: "chatboot-novo.firebaseapp.com",
  projectId: "chatboot-novo",
  storageBucket: "chatboot-novo.firebasestorage.app",
  messagingSenderId: "860972308447",
  appId: "1:860972308447:web:34eb59fb735bf93eb6966a",
  measurementId: "G-0DMHPSHSWE"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Tabs Login / Cadastro
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const errorMessage = document.getElementById("errorMessage");

// Alternar abas
tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  errorMessage.textContent = "";
});

tabRegister.addEventListener("click", () => {
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  errorMessage.textContent = "";
});

// Cadastro
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const senha = document.getElementById("regPassword").value;
  const tipo = document.getElementById("regTipo").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, "users", userCred.user.uid), {
      nome,
      email,
      tipo
    });
    window.location.href = tipo === "suporte" ? "suporte.html" : "cooperado.html";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginPassword").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, senha);
    const userDoc = await getDoc(doc(db, "users", userCred.user.uid));

    if (userDoc.exists()) {
      const tipo = userDoc.data().tipo;
      window.location.href = tipo === "suporte" ? "suporte.html" : "cooperado.html";
    } else {
      errorMessage.textContent = "Usuário não registrado no Firestore";
    }
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
