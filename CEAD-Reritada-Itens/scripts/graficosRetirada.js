import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    query,
    orderByChild,
    startAt,
    endAt,
    onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let quantidades = {
    kitHigiene: 0,
    Roupa: 0,
    Colchao: 0,
    roupaIntima: 0,
    kitLimpeza: 0,
    Toalha: 0,
    Fralda: 0,
    Cobertor: 0,
    Travesseiro: 0,
    cestaBasica: 0,
    Leite: 0
};

let graficoBarras;

function atualizarGrafico() {
    const contexto = document.getElementById("graficoIdades").getContext("2d");
    if (!graficoBarras) {
        graficoBarras = new Chart(contexto, {
            type: "bar",
            data: {
                labels: Object.keys(quantidades),
                datasets: [{
                    label: "Quantidade de Itens Retirados",
                    data: Object.values(quantidades),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#7BC043', '#F7464A', '#00FFFF', '#FFFF00']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } else {
        graficoBarras.data.datasets[0].data = Object.values(quantidades);
        graficoBarras.update();
    }
}

function filtrarDadosPorData(dataInicio, dataFim) {
    console.log("Filtrando dados de", dataInicio, "a", dataFim);
    const formattedStart = dataInicio + "T00:00:00.000Z";
    const formattedEnd = dataFim + "T23:59:59.999Z";
    const dataQuery = query(ref(database, "desabrigados"), orderByChild("dataCadastro"), startAt(formattedStart), endAt(formattedEnd));

    onValue(dataQuery, snapshot => {
        Object.keys(quantidades).forEach(key => {
            quantidades[key] = 0; // Reset quantidades
        });

        snapshot.forEach(childSnapshot => {
            const dados = childSnapshot.val();
            Object.keys(quantidades).forEach(item => {
                if (dados[item]) {
                    quantidades[item] += Number(dados[item]);
                }
            });
        });

        console.log("Dados após filtro:", quantidades);
        atualizarGrafico();
    }, {
        onlyOnce: true
    });
}

document.getElementById('btnFiltrar').addEventListener('click', function() {
    const dataSelecionada = document.getElementById('dataFiltro').value;
    if (dataSelecionada) {
        filtrarDadosPorData(dataSelecionada, dataSelecionada);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().split('T')[0];
    filtrarDadosPorData(today, today); // Filtra para o dia atual inicialmente
});
