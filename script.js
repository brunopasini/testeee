function addNewSection() {
    // Captura o nome da nova seção do formulário
    var newSectionName = document.getElementById("newSectionName").value;

    // Cria uma nova seção e grid
    var newSection = document.createElement("section");
    newSection.id = "section" + (document.querySelectorAll('.content section').length + 1);
    newSection.innerHTML = '<h2>' + newSectionName + '</h2><div class="grid-container" id="grid' + (document.querySelectorAll('.content section').length + 1) + '"></div>';

    // Adiciona a nova seção à área de conteúdo
    document.querySelector('.content').insertBefore(newSection, document.querySelector('footer'));

    // Limpa o campo do nome da nova seção
    document.getElementById("newSectionName").value = "";
}

function showSection(sectionId) {
    // Oculta todas as seções
    document.querySelectorAll('.content section').forEach(function (section) {
        section.style.display = 'none';
    });

    // Ativa o link correspondente na barra lateral
    document.querySelectorAll('.sidebar a').forEach(function (link) {
        link.classList.remove('active');
    });

    // Exibe a seção clicada
    document.getElementById(sectionId).style.display = 'block';

    // Ativa o link correspondente na barra lateral
    var correspondingLink = document.querySelector('.sidebar a[href="#"][onclick*="' + sectionId + '"]');
    if (correspondingLink) {
        correspondingLink.classList.add('active');
    }
}

// Chamada inicial para exibir a primeira seção
showSection('section1');


// Teste dos ips
document.addEventListener('DOMContentLoaded', function () {
    const nomesEips = {
        "Adm Parque Central": "187.102.2.9",
        "Agricultura": "187.102.2.21",
        "Arquivo": "187.102.2.91",
        "Assistência Social": "187.102.2.95",
        "Guarda Municipal": "187.102.2.22",
        "Casa de Passagem": "187.102.2.8",
        "Cemitério": "187.102.2.18",
        "Cras Central": "187.102.2.105",
        "Cras Martello": "187.102.2.15",
        "Cras Norte": "187.102.2.14",
        "Creas": "187.102.2.97",
        "Horto Florestal": "177.155.253.44",
        "Procon": "187.102.2.98",
        "Sindicância": "187.102.2.19",
        "Rodoviária": "187.102.15.72",
        "Tiro de Guerra": "187.102.2.107",
        "Estação": "187.102.2.99",
        "Cultura Esporte e Turismo": "187.102.2.17",

        // Adicione mais conforme necessário
    };

    function adicionarIPNaLista(nome, status, cor) {
        const lista = document.getElementById('ipList');
        const listItem = document.createElement('li');

        // Adiciona a bolinha indicadora visual com a cor personalizada
        const indicador = document.createElement('div');
        indicador.className = 'indicator';
        indicador.style.backgroundColor = cor;

        // Adiciona a bolinha antes do texto
        listItem.appendChild(indicador);

        // Adiciona o texto ao listItem
        listItem.appendChild(document.createTextNode(nome));

        // Altera a cor do texto com base no status
        // listItem.style.color = status ? 'green' : 'red';

        lista.appendChild(listItem);
    }


    function verificarStatus() {
        var nomes = Object.keys(nomesEips); // Obtém apenas os nomes do objeto

        var url = "http://localhost:3000/verificar?ips=" + nomes.map(nome => nomesEips[nome]).join(',');

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const nomesComPeloMenosUmTrue = [];
                const nomesTodosFalse = [];

                data.forEach(result => {
                    const nome = Object.keys(nomesEips).find(nome => nomesEips[nome] === result.ip);

                    if (result.status[3000] || result.status[8080] || result.status[8888]) {
                        nomesComPeloMenosUmTrue.push(nome);
                    } else {
                        nomesTodosFalse.push(nome);
                    }
                });

                console.log('Nomes com pelo menos um status true:', nomesComPeloMenosUmTrue);
                console.log('Nomes com todos os status false:', nomesTodosFalse);

                // Limpa a lista existente antes de adicionar os novos itens
                const lista = document.getElementById('ipList');
                lista.innerHTML = '';

                adicionarIPsNaLista(nomesComPeloMenosUmTrue, true, '#027502'); // Cor verde
                adicionarIPsNaLista(nomesTodosFalse, false, '#b3040c'); // Cor vermelha
            })
            .catch(error => {
                console.error('Erro na solicitação:', error);
            });
    }

    function adicionarIPsNaLista(nomes, status, cor) {
        nomes.forEach(nome => {
            adicionarIPNaLista(nome, status, cor);
        });
    }

    // Chama a função verificarStatus a cada 5 segundos (5000 milissegundos)
    setInterval(verificarStatus, 5000);

    // Chama verificarStatus uma vez ao carregar a página
    verificarStatus();
});

// Teste dos ips