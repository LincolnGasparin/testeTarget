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
import { produtoSchema } from './db/produtoSchema.js';

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
    const validatedData = produtoSchema.parse(req.body);
    const currentDate = new Date();
    await adicionaQuantidade(Number(validatedData.codigoProduto), Number(validatedData.estoque));
    await inserirTransacao(validatedData.tipo, currentDate.toISOString(), Number(validatedData.estoque), Number(validatedData.codigoProduto));
    res.status(200).send(`Adicionou ${validatedData.estoque} ao produto ${validatedData.codigoProduto}`);
});

app.post('/remove', async (req, res) => {
    const validatedData = produtoSchema.parse(req.body);
    const currentDate = new Date();
    await removeQuantidade(Number(validatedData.codigoProduto), Number(validatedData.estoque));
    await inserirTransacao(validatedData.tipo, currentDate.toISOString(), Number(validatedData.estoque), Number(validatedData.codigoProduto));
    res.status(200).send(`Removeu ${validatedData.estoque} do produto ${validatedData.codigoProduto}`);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
