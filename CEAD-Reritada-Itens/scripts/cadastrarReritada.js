// Função para aplicar máscara de CPF
function aplicarMascaraCPF(campo) {
    let cpf = campo.value;
    cpf = cpf.replace(/\D/g, ""); // Remove tudo o que não é dígito
    cpf = cpf.substring(0, 11); // Limita o máximo de caracteres

    // Aplica a máscara
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    campo.value = cpf; // Atualiza o valor do campo
}

// Adicionar o evento de input ao campo CPF
document.getElementById("cpf").addEventListener("input", function() {
    aplicarMascaraCPF(this);
});


// Inicializar o Firebase e banco de dados
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    update,
    query,
    orderByChild,
    equalTo,
    get
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
const database = getDatabase(app);

// Função para alterar a quantidade dos itens
function alterarQuantidade(item, delta) {
    const input = document.getElementById(item);
    let quantidade = parseInt(input.value, 10) + delta;
    quantidade = Math.max(0, quantidade); // Garante que a quantidade não seja negativa
    input.value = quantidade;
}

// Expondo a função ao escopo global
window.alterarQuantidade = alterarQuantidade;

// Função para cadastrar ou atualizar dados
function cadastrarDesabrigado(event) {
    event.preventDefault(); // Evitar o recarregamento da página

    const cpf = document.getElementById("cpf").value;
    if (!cpf) {
        alert("CPF é necessário para o cadastro.");
        return;
    }

    const desabrigadosRef = query(ref(database, "desabrigados"), orderByChild("cpf"), equalTo(cpf));
    get(desabrigadosRef).then((snapshot) => {
        if (snapshot.exists()) {
            alert("A pessoa já está cadastrada.");
            buscarDesabrigado(); // Chama a função de buscar
        } else {
            criarCadastro();
        }
    }).catch((error) => {
        console.error("Erro ao verificar o CPF: " + error.message);
    });
}

// Função para criar o cadastro no banco de dados
function criarCadastro() {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const dataCadastro = new Date().toISOString(); // Captura a data e hora atual

    // Adicionando todos os itens com quantidades
    const itens = {};
    // Certifique-se de que todos os inputs dentro dos itens tenham um 'name' que corresponde exatamente ao que você deseja enviar ao Firebase
    document.querySelectorAll('#itens .item input[type="text"]').forEach(item => {
        const itemName = item.getAttribute('name'); // Pega o nome do input, que deve ser o mesmo que o nome do item no banco de dados
        itens[itemName] = item.value || '0'; // Adiciona ao objeto 'itens', usando o nome do item como chave
    });

    const dadosRegistro = {
        nome,
        cpf,
        ...itens,
        dataCadastro
    };

    // Criar uma chave única para o novo registro
    const novoRegistroRef = ref(database, 'desabrigados/' + Date.now());

    // Enviar dados para o Realtime Database
    set(novoRegistroRef, dadosRegistro)
    .then(() => {
        alert('Cadastro realizado com sucesso!');
        document.getElementById("cadastroForm").reset(); // Limpar o formulário após o cadastro
    })
    .catch((error) => {
        alert('Erro ao cadastrar: ' + error.message);
    });
}


// Função para buscar dados do desabrigado pelo CPF e preencher o formulário
function buscarDesabrigado() {
    const cpf = document.getElementById("cpf").value;
    const desabrigadosRef = query(ref(database, "desabrigados"), orderByChild("cpf"), equalTo(cpf));

    get(desabrigadosRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const dados = childSnapshot.val();
                document.getElementById("nome").value = dados.nome || "";
                
                // Atualizar campos de itens
                document.getElementById("kitHigiene").value = dados.kitHigiene || "0";
                document.getElementById("Roupa").value = dados.Roupa || "0";
                document.getElementById("Colchao").value = dados.Colchao || "0";
                document.getElementById("roupaIntima").value = dados.roupaIntima || "0";
                document.getElementById("kitLimpeza").value = dados.kitLimpeza || "0";
                document.getElementById("Toalha").value = dados.Toalha || "0";
            });
        } else {
            alert("Nenhum registro encontrado para o CPF fornecido.");
            document.getElementById("cadastroForm").reset(); // Limpa o formulário se nenhum dado for encontrado
        }
    }).catch((error) => {
        console.error("Erro ao buscar: " + error.message);
    });
}


// Associar a função `cadastrarDesabrigado` ao evento de envio do formulário
document.getElementById("cadastroForm").addEventListener("submit", cadastrarDesabrigado);

// Expor funções ao escopo global
window.buscarDesabrigado = buscarDesabrigado;
window.cadastrarDesabrigado = cadastrarDesabrigado;


// Função para alterar os dados de um desabrigado existente
window.alterarDesabrigado = function() {
    const cpf = document.getElementById("cpf").value;
    const desabrigadosRef = query(ref(database, "desabrigados"), orderByChild("cpf"), equalTo(cpf));

    get(desabrigadosRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const chaveDesabrigadoEncontrado = childSnapshot.key; // Captura a chave do registro encontrado
                const dadosAtualizados = {
                    nome: document.getElementById("nome").value,
                    cpf: document.getElementById("cpf").value, // Supondo que o CPF pode ser atualizado, se não, remova esta linha
                    kitHigiene: document.getElementById("kitHigiene").value || '0',
                    Roupa: document.getElementById("Roupa").value || '0',
                    Colchao: document.getElementById("Colchao").value || '0',
                    roupaIntima: document.getElementById("roupaIntima").value || '0',
                    kitLimpeza: document.getElementById("kitLimpeza").value || '0',
                    Toalha: document.getElementById("Toalha").value || '0',
                    dataCadastro: new Date().toISOString() // Atualiza a data de cadastro para a data atual
                };

                update(ref(database, 'desabrigados/' + chaveDesabrigadoEncontrado), dadosAtualizados)
                .then(() => {
                    alert("Dados atualizados com sucesso!");
                    document.getElementById("cadastroForm").reset(); // Limpar o formulário após a atualização
                })
                .catch((error) => {
                    alert("Erro ao atualizar os dados: " + error.message);
                });
            });
        } else {
            alert("Desabrigado não encontrado.");
        }
    }).catch((error) => {
        console.error("Erro ao buscar desabrigado para atualização: " + error.message);
    });
};


// Associar a função `cadastrarDesabrigado` ao evento de envio do formulário
document.getElementById("cadastroForm").addEventListener("submit", cadastrarDesabrigado);

// Adicionar evento `input` para aplicar máscara de CPF ao campo correspondente
document.getElementById("cpfProprietario").addEventListener("input", function () {
    aplicarMascaraCPF(this);
});

// Tornar as funções acessíveis no escopo global
window.buscarDesabrigado = buscarDesabrigado;
window.cadastrarDesabrigado = cadastrarDesabrigado;
