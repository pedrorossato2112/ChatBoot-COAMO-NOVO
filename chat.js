import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, getDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// Configuração Firebase
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

const listaChamados = document.getElementById("listaChamados");
const mensagensDiv = document.getElementById("mensagens");
const novaMensagemInput = document.getElementById("novaMensagem");
const enviarBtn = document.getElementById("enviarMensagem");

let cooperadoSelecionado = null;

// Checa se usuário está logado e é suporte
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists() || userDoc.data().tipo !== "suporte") {
    alert("Acesso negado");
    window.location.href = "login.html";
  } else {
    carregarChamados();
  }
});

// Carregar lista de cooperados com chamados
function carregarChamados() {
  const chamadosRef = collection(db, "chamados");
  onSnapshot(chamadosRef, (snapshot) => {
    listaChamados.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const li = document.createElement("li");
      li.textContent = data.nome;
      li.dataset.uid = docSnap.id;
      li.addEventListener("click", () => abrirChat(docSnap.id, data.nome));
      listaChamados.appendChild(li);
    });
  });
}

// Abrir chat
function abrirChat(uid, nome) {
  cooperadoSelecionado = uid;
  mensagensDiv.innerHTML = "";

  const q = query(collection(db, "chamados", uid, "mensagens"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    mensagensDiv.innerHTML = "";
    snapshot.forEach(docSnap => {
      const msg = docSnap.data();
      const p = document.createElement("p");
      p.textContent = msg.texto;
      p.classList.add("mensagem");
      p.classList.add(msg.remetente === "Cooperado" ? "cooperado" : "suporte");
      mensagensDiv.appendChild(p);
      mensagensDiv.scrollTop = mensagensDiv.scrollHeight;
    });
  });
}

// Enviar mensagem do suporte
enviarBtn.addEventListener("click", async () => {
  const texto = novaMensagemInput.value.trim();
  if (!texto || !cooperadoSelecionado) return;

  await addDoc(collection(db, "chamados", cooperadoSelecionado, "mensagens"), {
    remetente: "Suporte",
    texto,
    timestamp: new Date()
  });

  novaMensagemInput.value = "";
});
