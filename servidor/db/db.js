import sql from 'mssql';
import { config } from './config.js';

async function adicionaQuantidade(codigoProduto, quantidade) {
    try {
        var poolConnection = await sql.connect(config);
        const transaction = new sql.Transaction(poolConnection);
        await transaction.begin();
        const request = new sql.Request(transaction);
        await request.query(
            `UPDATE Estoque SET estoque = estoque + ${quantidade} WHERE codigoProduto = ${codigoProduto}`
        );
        await transaction.commit();
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

async function removeQuantidade(codigoProduto, quantidade) {
    try {
        var poolConnection = await sql.connect(config);
        const transaction = new sql.Transaction(poolConnection);
        await transaction.begin();
        console.log('Updating data in the Table...');
        var request = new sql.Request(transaction);
        await request.query(
            `UPDATE Estoque SET estoque = estoque - ${quantidade} WHERE codigoProduto = ${codigoProduto}`
        );
        await transaction.commit();
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

async function consultaEstoque() {
    try {
        var poolConnection = await sql.connect(config);
        console.log('Querying data from the Table...');
        var result = await poolConnection.request().query(`SELECT * FROM Estoque`);
        console.log(result.recordset);
        poolConnection.close();
        return result.recordset;
    } catch (err) {
        console.error(err.message);
    }
}
async function consultaRelatorio() {
    try {
        var poolConnection = await sql.connect(config);
        console.log('Querying data from the Table...');
        var result = await poolConnection
            .request()
            .query(
                `SELECT * FROM Transacoes LEFT JOIN Estoque ON Transacoes.id_estoque = Estoque.codigoProduto`
            );
        console.log(result.recordset);
        poolConnection.close();
        return result.recordset;
    } catch (err) {
        console.error(err.message);
    }
}

async function inserirTransacao(descricao, dataTempo, quantidade, idEstoque) {
    try {
        var poolConnection = await sql.connect(config);
        const transaction = new sql.Transaction(poolConnection);
        await transaction.begin();
        const request = new sql.Request(transaction);
        await request.query(
            `INSERT INTO Transacoes (descricao, data_transacao, quantidade, id_estoque) VALUES ('${descricao}', '${dataTempo}', ${quantidade}, ${idEstoque})`
        );
        await transaction.commit();
        poolConnection.close();
    } catch (err) {
        console.error(err.message);
    }
}

export {
    adicionaQuantidade,
    removeQuantidade,
    consultaEstoque,
    inserirTransacao,
    consultaRelatorio,
};
