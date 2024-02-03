const express = require('express');
const http = require('http');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/verificar', async (req, res) => {
    const ips = req.query.ips ? req.query.ips.split(',') : [];
    const ports = [3000, 8080, 8888];

    const resultados = [];

    for (const ip of ips) {
        const status = await verificarStatus(ip, ports);
        resultados.push({
            ip,
            status
        });
    }

    res.json(resultados);
});

async function verificarStatus(ip, ports) {
    return new Promise(resolve => {
        const resultadosPortas = {};

        const verificaPorta = (porta) => {
            const options = {
                host: ip,
                port: porta,
                timeout: 1000, // Ajuste conforme necessário
            };

            const req = http.request(options, (res) => {
                resultadosPortas[porta] = res.statusCode === 200;
                resolve(resultadosPortas);
            });

            req.on('error', () => {
                resultadosPortas[porta] = false;
                resolve(resultadosPortas);
            });

            req.end();
        };

        for (const porta of ports) {
            verificaPorta(porta);
        }
    });
}

app.listen(port, () => {
    console.log(`Servidor intermediário rodando em http://localhost:${port}`);
});