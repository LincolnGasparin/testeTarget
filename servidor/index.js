import express from 'express';
import fs from 'fs';
import cors from 'cors';
import {
    adicionaQuantidade,
    removeQuantidade,
    consultaEstoque,
    inserirTransacao,
    consultaRelatorio,
} from './db/db.js';

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send(`Servidor funcionando na porta ${port}`);
});

app.get('/teste1', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./dados/teste1.json', 'utf-8'));
    res.status(200).json(data);
});

app.get('/teste2', (req, res) => {
    const data = JSON.parse(fs.readFileSync('./dados/teste2.json', 'utf-8'));
    res.status(200).json(data);
});

app.get('/teste2dbtransacoes', async (req, res) => {
    const data = await consultaRelatorio();
    res.status(200).json(data);
});

app.get('/teste2db', async (req, res) => {
    const data = await consultaEstoque();
    res.status(200).json(data);
});

app.post('/adiciona', async (req, res) => {
    const { codigoProduto, estoque, tipo } = req.body;
    const currentDate = new Date();
    const quantidadeEstoque = Number(estoque);
    await adicionaQuantidade(codigoProduto, Number(estoque));
    await inserirTransacao(tipo, currentDate.toISOString(), quantidadeEstoque, codigoProduto);
    res.status(200).send(`Adicionou ${quantidade} ao produto ${codigoProduto}`);
});

app.post('/remove', async (req, res) => {
    const { codigoProduto, estoque, tipo } = req.body;
    const currentDate = new Date();
    const quantidadeEstoque = Number(estoque);
    await removeQuantidade(codigoProduto, quantidadeEstoque);
    await inserirTransacao(tipo, currentDate.toISOString(), quantidadeEstoque, codigoProduto);
    res.status(200).send(`Removeu ${quantidadeEstoque} do produto ${codigoProduto}`);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
