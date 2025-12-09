'use client';

import { useEffect, useState } from 'react';
import Header from '../componentes/header';

export default function teste3() {
  const [valor, setValor] = useState<number>(0);
  const [dataAtual, setDataAtual] = useState<string>('');
  const [taxaJurosDiaria, setTaxaJurosDiaria] = useState<string>('');
  const [dataVencimento, setDataVencimento] = useState<string>('');
  const [valorFinal, setValorFinal] = useState<number>(0);

  useEffect(() => {
    calularDiaAtual();
  }, []);

  function calularDiaAtual() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataCerta = new Date(`${ano}-${mes}-${dia}`);
    setDataAtual(
      dataCerta.getDate() + '/' + (dataCerta.getMonth() + 1) + '/' + dataCerta.getFullYear()
    );
    return dataCerta;
  }

  function pegarDados(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const valorInformado = Number(formData.get('valor'));
    const taxaInformada = parseFloat(formData.get('taxaJurosDiaria') as string);
    const dataVencimentoInformada = formData.get('dataVencimento')?.toString() ?? '';

    // mantém estados sincronizados com o formulário
    setValor(valorInformado);
    setTaxaJurosDiaria(taxaInformada.toString());
    setDataVencimento(dataVencimentoInformada);

    calcularJuros(calularDiaAtual(), dataVencimentoInformada, taxaInformada, valorInformado);
  }

  function calcularJuros(
    dataAtual: Date | undefined,
    dataVencimento: string | undefined,
    taxaJurosDiaria: number,
    valor: number
  ) {
    if (!dataAtual || !dataVencimento) return;

    // normaliza horários para evitar erros de fuso
    const hoje = new Date(
      dataAtual.getFullYear(),
      dataAtual.getMonth(),
      dataAtual.getDate()
    ).getTime();
    const vencimento = new Date(dataVencimento).getTime();
    const msPorDia = 1000 * 60 * 60 * 24;
    const diferencaDias = Math.max(0, Math.ceil((vencimento - hoje) / msPorDia));

    const juros = valor * (taxaJurosDiaria / 100) * diferencaDias;
    setValorFinal(valor + juros);
  }

  return (
    <>
      <Header />
      <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-slate-500">Simulador</p>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Juros com data de vencimento
              </h1>
            </div>
            <div className="mt-2 sm:mt-0 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              Data atual: {dataAtual || '--/--/----'}
            </div>
          </div>

          <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={pegarDados}>
            <label
              className="flex flex-col gap-2 text-sm font-medium text-slate-700"
              htmlFor="valor"
            >
              Valor inicial
              <input
                type="number"
                id="valor"
                name="valor"
                min="0"
                step="0.01"
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Ex: 1000"
                required
              />
            </label>

            <label
              className="flex flex-col gap-2 text-sm font-medium text-slate-700"
              htmlFor="dataVencimento"
            >
              Data de vencimento
              <input
                type="date"
                id="dataVencimento"
                name="dataVencimento"
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                required
              />
            </label>

            <label
              className="flex flex-col gap-2 text-sm font-medium text-slate-700"
              htmlFor="taxaJurosDiaria"
            >
              % de juros ao dia
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                id="taxaJurosDiaria"
                name="taxaJurosDiaria"
                className="rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                placeholder="Ex: 0.5"
                required
              />
            </label>

            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="inline-flex justify-center items-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 transition"
              >
                Calcular juros
              </button>
            </div>
          </form>
          <p className="text-sm text-slate-500 text-baseline">usar . para separar centavos</p>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Valor final estimado</p>
              <p className="text-3xl font-bold text-slate-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  valorFinal
                )}
              </p>
            </div>
            <div className="text-sm text-slate-500">
              Juros diários informados:{' '}
              <span className="font-semibold text-slate-900">{taxaJurosDiaria || '0'}%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
