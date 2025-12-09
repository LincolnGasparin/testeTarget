'use client';

import { use, useEffect, useState } from 'react';
import Header from '../componentes/header';
import api from '../api/api';

export default function teste2() {
  const [transacoes, setTransacoes] = useState<Transacoes[]>([]);
  const [estoques, setEstoques] = useState<Produto[]>([]);
  const [estoqueDb, setEstoqueDb] = useState<Produto[]>([]);
  const [quantidade, setQuantidade] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>('');
  const [codigoProduto, setCodigoProduto] = useState<number>(0);

  type Produto = {
    codigoProduto: Number;
    descricaoProduto: string;
    estoque: number;
  };

  type Transacoes = {
    id: number;
    descricao: string;
    codigoProduto: number;
    descricaoProduto: string;
    data_transacao: string;
    quantidade: number;
  };

  async function fetchTransacoes() {
    try {
      const resposta = await api.get('/teste2dbtransacoes');
      const respostaData = resposta.data;
      console.log('Dados de transações recebidos:', respostaData);

      if (!respostaData) {
        setTransacoes([]);
        return;
      }

      let data;
      if (typeof respostaData === 'string') {
        try {
          data = JSON.parse(respostaData);
        } catch (error) {
          console.error('Error parsing sales data JSON:', error);
          setTransacoes([]);
          return;
        }
      } else {
        data = respostaData;
      }
      if (Array.isArray(data)) {
        setTransacoes(data);
      } else if (data && typeof data === 'object' && data !== null) {
        const arrayProperty = Object.keys(data).find((key) => Array.isArray(data[key]));
        if (arrayProperty) {
          setTransacoes(data[arrayProperty]);
        } else {
          console.error(
            'Error: The data received is an object, but contains no array. The table will remain empty.'
          );
          setTransacoes([]);
        }
      } else {
        console.error('Error: The data received is not an array. The table will remain empty.');
        setTransacoes([]);
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
      setTransacoes([]);
    }
  }

  async function fetchEstoqueDb() {
    try {
      const resposta = await api.get('/teste2db');
      const respostaData = resposta.data;
      console.log('Dados de estoques DB recebidos:', respostaData);
      let data;
      if (typeof respostaData === 'string') {
        try {
          data = JSON.parse(respostaData);
        } catch (error) {
          console.error('Error parsing sales data JSON:', error);
          setEstoqueDb([]);
          return;
        }
      } else {
        data = respostaData;
      }
      if (Array.isArray(data)) {
        setEstoqueDb(data);
      } else if (data && typeof data === 'object' && data !== null) {
        const arrayProperty = Object.keys(data).find((key) => Array.isArray(data[key]));
        if (arrayProperty) {
          setEstoqueDb(data[arrayProperty]);
        } else {
          console.error(
            'Error: The data received is an object, but contains no array. The table will remain empty.'
          );
          setEstoqueDb([]);
        }
      } else {
        console.error('Error: The data received is not an array. The table will remain empty.');
        setEstoqueDb([]);
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
      setEstoqueDb([]);
    }
  }

  async function fetchEstoques() {
    try {
      const resposta = await api.get('/teste2');
      const respostaData = resposta.data;
      console.log('Dados de estoques recebidos:', respostaData);

      let data;
      if (typeof respostaData === 'string') {
        try {
          data = JSON.parse(respostaData);
        } catch (error) {
          console.error('Error parsing sales data JSON:', error);
          setEstoques([]);
          return;
        }
      } else {
        data = respostaData;
      }

      if (Array.isArray(data)) {
        setEstoques(data);
      } else if (data && typeof data === 'object' && data !== null) {
        const arrayProperty = Object.keys(data).find((key) => Array.isArray(data[key]));
        if (arrayProperty) {
          setEstoques(data[arrayProperty]);
        } else {
          console.error(
            'Error: The data received is an object, but contains no array. The table will remain empty.'
          );
          setEstoques([]);
        }
      } else {
        console.error('Error: The data received is not an array. The table will remain empty.');
        setEstoques([]);
      }
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
      setEstoques([]);
    }
  }

  async function enviarTransacao(movimento: FormData) {
    const formTransacao = new FormData();
    formTransacao.append('codigoProduto', movimento.get('codigoProduto')!.toString());
    formTransacao.append('estoque', parseInt(movimento.get('estoque')!.toString()).toString());
    formTransacao.append('tipo', movimento.get('tipo')!.toString());
    console.log(movimento.get('tipo'));
    try {
      if(movimento.get('tipo') === 'entrada') {
        const resposta = await api.post('/adiciona', formTransacao, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Transação enviada com sucesso:', resposta.data);
      } else {
        const resposta = await api.post('/remove', formTransacao, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Transação enviada com sucesso:', resposta.data);
      }
    } catch (error) {
      console.error('Erro ao enviar transação:', error);
    }
  }

  useEffect(() => {
    fetchEstoques();
    fetchEstoqueDb();
    fetchTransacoes();
  }, [descricao, quantidade, codigoProduto]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white text-slate-800">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
          <section className="bg-white/80 backdrop-blur shadow-xl rounded-3xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estoque</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  Painel de Estoques
                </h1>
                <p className="text-base sm:text-lg text-slate-500">Visão geral dos saldos</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-blue-600/70">Itens (API)</p>
                  <p className="text-xl sm:text-2xl font-semibold">{estoques.length}</p>
                </div>
                <div className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-emerald-600/70">Itens (DB)</p>
                  <p className="text-xl sm:text-2xl font-semibold">{estoqueDb.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Estoque (DB)</h2>
                    <p className="text-sm text-slate-500">Dados persistidos</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                    {estoqueDb.length} itens
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Código</th>
                        <th className="px-6 py-3 text-left font-semibold">Produto</th>
                        <th className="px-6 py-3 text-left font-semibold">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {estoqueDb.map((estoque, index) => (
                        <tr
                          key={estoque?.codigoProduto?.toString() ?? index}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                            {estoque?.codigoProduto?.toString() ?? ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                            {estoque?.descricaoProduto ?? ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                            {estoque?.estoque ?? ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Estoque (API)</h2>
                    <p className="text-sm text-slate-500">Consulta em tempo real</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                    {estoques.length} itens
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Código</th>
                        <th className="px-6 py-3 text-left font-semibold">Produto</th>
                        <th className="px-6 py-3 text-left font-semibold">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {estoques.map((estoque, index) => (
                        <tr
                          key={estoque?.codigoProduto?.toString() ?? index}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                            {estoque?.codigoProduto?.toString() ?? ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                            {estoque?.descricaoProduto ?? ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                            {estoque?.estoque ?? ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <section
            id="container-form"
            className="bg-white/80 backdrop-blur shadow-xl rounded-3xl border border-slate-200 p-6 sm:p-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Cadastro</p>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">Formulário CRUD</h2>
                <p className="text-sm text-slate-500">Inclua movimentações de entrada ou saída</p>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 text-sm font-semibold">
                Atualiza estoque automaticamente
              </div>
            </div>

            <div className="mt-6">
              <form
                method="post"
                onSubmit={async (e) => {
                  const formData = new FormData(e.currentTarget);
                  await enviarTransacao(formData);
                  fetchEstoques();
                }}
                id="form-crud"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="codigoProduto">
                  Código do Produto
                  <input
                    type="number"
                    onChange={(e) => setCodigoProduto(parseInt(e.target.value))}
                    id="codigoProduto"
                    name="codigoProduto"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="Ex: 123"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="estoque">
                  Quantidade
                  <input
                    type="number"
                    onChange={(e) => setQuantidade(parseInt(e.target.value))}
                    id="estoque"
                    name="estoque"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="Ex: 10"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium text-slate-700" htmlFor="tipo">
                  Tipo de Transação
                  <select
                    id="tipo"
                    name="tipo"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  >
                    <option value="entrada">Entrada</option>
                    <option value="saida">Saída</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 transition"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="bg-white/80 backdrop-blur shadow-xl rounded-3xl border border-slate-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Movimentações</p>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">Relatório de Movimentações</h2>
                <p className="text-sm text-slate-500">Histórico de entradas e saídas</p>
              </div>
              <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-sm font-semibold">
                {transacoes.length} registros
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Descrição</th>
                    <th className="px-6 py-3 text-left font-semibold">Código</th>
                    <th className="px-6 py-3 text-left font-semibold">Produto</th>
                    <th className="px-6 py-3 text-left font-semibold">Quantidade</th>
                    <th className="px-6 py-3 text-left font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transacoes.map((transacao, index) => (
                    <tr
                      key={`${transacao.id}-${index}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                        {transacao.descricao}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {Number(transacao.codigoProduto).toString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {transacao.descricaoProduto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {transacao.quantidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {new Date(transacao.data_transacao).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
