import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configuração Firebase (mesma do login.js)
const firebaseConfig = {
  apiKey: "AIzaSyABNpGsF0ckrYw63ysUC6jYAT-YnWd0xYk",
  authDomain: "chatboot-novo.firebaseapp.com",
  projectId: "chatboot-novo",
  storageBucket: "chatboot-novo.firebasestorage.app",
  messagingSenderId: "860972308447",
  appId: "1:860972308447:web:34eb59fb735bf93eb6966a",
  measurementId: "G-0DMHPSHSWE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const mensagensDiv = document.getElementById("mensagens");
const novaMensagemInput = document.getElementById("novaMensagem");
const enviarBtn = document.getElementById("enviarMensagem");
const criarChamadoBtn = document.getElementById("criarChamado");

let cooperadoUid = null;

// Checa login
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  cooperadoUid = user.uid;
  carregarMensagens();
});

// Criar chamado
criarChamadoBtn.addEventListener("click", async () => {
  if (!cooperadoUid) return;

  await addDoc(collection(db, "chamados", cooperadoUid, "mensagens"), {
    remetente: "Cooperado",
    texto: "Novo chamado criado",
    timestamp: new Date()
  });

  alert("Chamado criado com sucesso! Você já pode enviar mensagens.");
});

// Carregar mensagens em tempo real
function carregarMensagens() {
  const q = query(collection(db, "chamados", cooperadoUid, "mensagens"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    mensagensDiv.innerHTML = "";
    snapshot.forEach(docSnap => {
  const msg = docSnap.data();
  const p = document.createElement("p");
  p.textContent = msg.texto;
  p.classList.add("mensagem");

  if (msg.remetente === "Cooperado") {
    p.classList.add("cooperado");
  } else {
    p.classList.add("suporte");
  }

  mensagensDiv.appendChild(p);
  mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
});

  });
}

// Enviar mensagem do cooperado
enviarBtn.addEventListener("click", async () => {
  const texto = novaMensagemInput.value.trim();
  if (!texto) return;

  await addDoc(collection(db, "chamados", cooperadoUid, "mensagens"), {
    remetente: "Cooperado",
    texto,
    timestamp: new Date()
  });

  novaMensagemInput.value = "";
});
