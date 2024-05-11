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

// Inicializa as variáveis para contar os itens
let quantidades = {
    kitHigiene: 0,
    Roupa: 0,
    Colchao: 0,
    roupaIntima: 0,
    kitLimpeza: 0,
    Toalha: 0
};

// Referência à lista de desabrigados
const desabrigadosRef = ref(database, "desabrigados");

// Inicializa a estrutura do gráfico para barras
let graficoBarras;

// Função para atualizar o gráfico de barras com novos dados
function atualizarGrafico() {
    const contexto = document.getElementById("graficoIdades").getContext("2d");

    // Se o gráfico já foi criado, apenas atualize os dados
    if (graficoBarras) {
        graficoBarras.data.datasets[0].data = Object.values(quantidades);
        graficoBarras.update(); // Atualiza os dados no gráfico
    } else {
        // Cria o gráfico de barras pela primeira vez
        graficoBarras = new Chart(contexto, {
            type: "bar", // Tipo de gráfico de barras
            data: {
                labels: Object.keys(quantidades),
                datasets: [{
                    label: "Quantidade de Itens Retirados",
                    data: Object.values(quantidades),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }
}

// Processar cada nova entrada ao ser adicionada
onChildAdded(desabrigadosRef, (snapshot) => {
    const dados = snapshot.val();

    // Incrementar cada item baseado nos dados recebidos
    Object.keys(quantidades).forEach(item => {
        quantidades[item] += Number(dados[item] || 0);
    });

    // Atualizar o gráfico com os novos valores
    atualizarGrafico();
});
