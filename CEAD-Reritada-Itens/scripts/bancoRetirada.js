import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    onChildAdded
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyABJp-i8baIq6JScP4AWNGWYa9Rlgn3vN0",
    authDomain: "cead-reritada-itens.firebaseapp.com",
    databaseURL: "https://cead-reritada-itens-default-rtdb.firebaseio.com",
    projectId: "cead-reritada-itens",
    storageBucket: "cead-reritada-itens.appspot.com",
    messagingSenderId: "713809266601",
    appId: "1:713809266601:web:cc1a49165c5a90ebc266b8",
    measurementId: "G-P902G0C14X"
};

// Inicialize o app Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Inicialize o Realtime Database

// Referência à lista de desabrigados
const desabrigadosRef = ref(database, "desabrigados");

// Função para adicionar uma nova linha na tabela
function adicionarLinhaTabela(dados) {
    const tabelaBody = document.getElementById("tabelaDesabrigados").querySelector("tbody");

    // Cria uma nova linha
    const novaLinha = document.createElement("tr");

    // Formatar a data de cadastro para um formato mais legível
    const dataFormatada = dados.dataCadastro ? new Date(dados.dataCadastro).toLocaleDateString("pt-BR", {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }) : "";

    const dataForm = dados.dataEntrega ? new Date(dados.dataEntrega).toLocaleDateString("pt-BR", {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }) : "";


    // Preenche as células com os dados fornecidos
    novaLinha.innerHTML = `
        <td>${dataFormatada}</td>
        <td>${dados.nome || ""}</td>
        <td>${dados.cpf || ""}</td>
        <td>${dados.kitHigiene || ""}</td>
        <td>${dados.Roupa || ""}</td>
        <td>${dados.Colchao || ""}</td>
        <td>${dados.roupaIntima || ""}</td>
        <td>${dados.kitLimpeza || ""}</td>
        <td>${dados.Toalha || ""}</td>
        <td>${dados.Fralda || ""}</td>
        <td>${dados.Cobertor || ""}</td>
        <td>${dados.Travesseiro || ""}</td>
    `;

    // Adiciona a nova linha ao corpo da tabela
    tabelaBody.appendChild(novaLinha);
}

// Configura o evento `onChildAdded` para adicionar cada novo registro à tabela
onChildAdded(desabrigadosRef, (snapshot) => {
    const dados = snapshot.val();
    adicionarLinhaTabela(dados);
});
