'use client';

import { useEffect, useState } from 'react';
import Header from '../componentes/header';
import api from '../api/api';

// Defining a type for the data for clarity and safety
type Venda = {
  vendedor: string;
  valor: number;
};

// Defining a type for the commission data
type ComissaoPorVendedor = {
  vendedor: string;
  totalComissao: number;
};

export default function teste1() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [comissoes, setComissoes] = useState<ComissaoPorVendedor[]>([]);

  useEffect(() => {
    // This function fetches data and updates the state safely.
    async function fetchVendas() {
      try {
        const resposta = await api.get('/teste1');
        const respostaData = resposta.data;
        // This log is important! Check your browser's developer console to see what the API returns.
        console.log('Dados de vendas recebidos:', respostaData);

        let data;
        if (typeof respostaData === 'string') {
          try {
            data = JSON.parse(respostaData);
          } catch (error) {
            console.error('Error parsing sales data JSON:', error);
            setVendas([]);
            return;
          }
        } else {
          data = respostaData;
        }

        if (Array.isArray(data)) {
          setVendas(data);
        } else if (data && typeof data === 'object' && data !== null) {
          const arrayProperty = Object.keys(data).find((key) => Array.isArray(data[key]));
          if (arrayProperty) {
            setVendas(data[arrayProperty]);
          } else {
            console.error(
              'Error: The data received is an object, but contains no array. The table will remain empty.'
            );
            setVendas([]);
          }
        } else {
          console.error('Error: The data received is not an array. The table will remain empty.');
          setVendas([]);
        }
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
        setVendas([]);
      }
    }

    fetchVendas();
  }, []);

  useEffect(() => {
    if (vendas.length > 0) {
      const comissoesCalculadas = calcularComissoesPorVendedor(vendas);
      setComissoes(comissoesCalculadas);
    }
  }, [vendas]);

  function calcular_valor_comissao(valor_venda: number): number {
    if (valor_venda <= 100) {
      return 0;
    } else if (valor_venda <= 500) {
      return valor_venda * 0.01;
    } else if (valor_venda > 500) {
      return valor_venda * 0.05;
    }
    return 0;
  }

  function calcularComissoesPorVendedor(vendas: Venda[]): ComissaoPorVendedor[] {
    const comissoesMap = new Map<string, number>();

    vendas.forEach((venda) => {
      const comissao = calcular_valor_comissao(venda.valor);
      if (comissoesMap.has(venda.vendedor)) {
        comissoesMap.set(venda.vendedor, comissoesMap.get(venda.vendedor)! + comissao);
      } else {
        comissoesMap.set(venda.vendedor, comissao);
      }
    });

    return Array.from(comissoesMap.entries()).map(([vendedor, totalComissao]) => ({
      vendedor,
      totalComissao,
    }));
  }

  function calcularTotalComissoes(): number {
    if (!Array.isArray(vendas)) {
      return 0;
    }
    return vendas.reduce((total, venda) => {
      const comissao = calcular_valor_comissao(venda.valor) || 0;
      return total + comissao;
    }, 0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white text-slate-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <section className="bg-white/80 backdrop-blur shadow-xl rounded-3xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Relatório de Vendas
              </h1>
              <p className="text-base sm:text-lg text-slate-500">
                Análise de comissões por vendedor
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-blue-600/70">Total em comissões</p>
                <p className="text-xl sm:text-2xl font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    calcularTotalComissoes()
                  )}
                </p>
              </div>
              <div className="px-4 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-emerald-600/70">Vendedores</p>
                <p className="text-xl sm:text-2xl font-semibold">{comissoes.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Vendas registradas</h2>
                  <p className="text-sm text-slate-500">Lista detalhada com valor e comissão</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
                  {vendas.length} registros
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left font-semibold">
                        Vendedor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left font-semibold">
                        Valor da venda
                      </th>
                      <th scope="col" className="px-6 py-3 text-left font-semibold">
                        Comissão
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendas.map((venda, index) => (
                      <tr
                        key={`${venda.vendedor}-${index}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                          {venda.vendedor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(venda.valor)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(calcular_valor_comissao(venda.valor))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
                <div className="text-sm text-slate-600">
                  Total de comissões deste relatório:
                  <span className="ml-2 font-semibold text-emerald-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      calcularTotalComissoes()
                    )}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Valores calculados automaticamente conforme faixas de comissão.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Comissão por vendedor</h2>
                  <p className="text-sm text-slate-500">
                    Soma das comissões em todas as vendas
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                  Ranking
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wide text-xs">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left font-semibold">
                        Vendedor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left font-semibold">
                        Comissão mensal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {comissoes.map((comissao, index) => (
                      <tr
                        key={`${comissao.vendedor}-${index}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                          {comissao.vendedor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(comissao.totalComissao)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
