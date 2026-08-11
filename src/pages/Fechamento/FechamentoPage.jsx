import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FiUpload, FiPrinter, FiMessageCircle } from "react-icons/fi";

import logoPadrao from "../../assets/LogoGustavo.png";
import { gerarPixCopiaECola } from "../../utils/pix/pixPayload";
import { montarLinkWhatsapp } from "../../utils/whatsapp/whatsappLink";
import { listarProdutos } from "../../services/produtos";
import { processarFechamento } from "../../services/filaOffline";
import { obterConfiguracoes, configPadrao } from "../../services/configuracoes";
import { listarClientes, listarAnimais } from "../../services/clientes";

import HeaderFechamento from "../../components/fechamento/HeaderFechamento";
import ClienteSection from "../../components/fechamento/ClienteSection";
import RelatorioSection from "../../components/fechamento/RelatorioSection";
import ItensTable from "../../components/fechamento/ItensTable";
import TotaisCard from "../../components/fechamento/TotaisCard";
import PagamentoSection from "../../components/fechamento/PagamentoSection";

import "./fechamento.print.css";

// Rascunho do fechamento em andamento. Existe porque no celular, ao abrir o
// menu de compartilhar/imprimir do PDF, o navegador pode recarregar a pagina
// em segundo plano e apagar tudo que tinha sido preenchido. Com isso salvo,
// ao voltar o formulario continua com os dados (cliente, itens, etc.), em vez
// de aparecer em branco.
const RASCUNHO_KEY = "rascunho_fechamento";

function lerRascunho() {
  try {
    const raw = localStorage.getItem(RASCUNHO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Produtos "un" sao contaveis (3 seringas, 2 ferraduras...) -- nesses casos
// Valor continua sendo o preco de cada um, multiplicado pela Qtd. Ja em
// produtos por volume/peso (ml, kg, l...) nao faz sentido "preco por ml":
// o Gustavo digita quanto usou (Qtd, em ml) so pra controlar o estoque, e
// quanto vai cobrar (Valor) direto, sem multiplicar.
function ehUnidadeContavel(unidade) {
  const u = (unidade || "un").trim().toLowerCase();
  return u === "un" || u === "";
}

function calcularTotalMaterial(item, produtos) {
  const price = Number(item.price) || 0;
  const produto = produtos.find((p) => String(p.id) === String(item.produtoId));

  if (item.produtoId && produto && !ehUnidadeContavel(produto.unidade)) {
    return price;
  }

  const qtd = Number(item.qtd) || 0;
  return qtd * price;
}

export default function FechamentoPage() {
  const printRef = useRef(null);
  const salvandoPdfRef = useRef(false);

  const initialClient = {
    name: "",
    animal: "",
    ref: "",
    date: new Date().toLocaleDateString("pt-BR"),
  };

  const initialMaterials = [{ id: 1, desc: "", qtd: 1, price: 0, precoAuto: true }];

  const initialServices = [{ id: 1, desc: "", date: "", km: "", price: 0 }];

  const montarPagamento = (cfg) => ({
    method: "pix",
    status: "pendente",
    discount: 0,
    addition: 0,
    pix: cfg.pix_chave || "",
    bank: cfg.banco || "",
    agency: cfg.agencia || "",
    cc: cfg.conta || "",
    favorecido: cfg.pix_favorecido || "",
    cidade: cfg.pix_cidade || "",
    txid: "***",
    descricaoPix: cfg.pix_descricao || "Fechamento de atendimento",
  });

  const initialDesconto = { ativo: false, tipo: "percentual", valor: "" };

  const [config, setConfig] = useState(configPadrao);
  const [logo, setLogo] = useState(logoPadrao);
  const [client, setClient] = useState(() => lerRascunho()?.client ?? initialClient);
  const [relatorio, setRelatorio] = useState(() => lerRascunho()?.relatorio ?? "");
  const [materials, setMaterials] = useState(
    () => lerRascunho()?.materials ?? initialMaterials
  );
  const [services, setServices] = useState(() => lerRascunho()?.services ?? initialServices);
  const [descontoServico, setDescontoServico] = useState(
    () => lerRascunho()?.descontoServico ?? initialDesconto
  );
  const [payment, setPayment] = useState(montarPagamento(configPadrao));
  const [financeiroRegistrado, setFinanceiroRegistrado] = useState(
    () => lerRascunho()?.financeiroRegistrado ?? false
  );
  const [salvandoPdf, setSalvandoPdf] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [animais, setAnimais] = useState([]);
  const [salvoOffline, setSalvoOffline] = useState(() => lerRascunho()?.salvoOffline ?? false);

  // Salva o progresso a cada alteracao, pra sobreviver a um recarregamento
  // inesperado da pagina (ex: ao abrir o menu de imprimir/compartilhar no
  // celular).
  useEffect(() => {
    try {
      localStorage.setItem(
        RASCUNHO_KEY,
        JSON.stringify({
          client,
          relatorio,
          materials,
          services,
          descontoServico,
          financeiroRegistrado,
          salvoOffline,
        })
      );
    } catch {
      // autosave e so uma conveniencia; se falhar, nao impede o uso
    }
  }, [client, relatorio, materials, services, descontoServico, financeiroRegistrado, salvoOffline]);

  useEffect(() => {
    (async () => {
      try {
        const lista = await listarProdutos();
        setProdutos(lista || []);
      } catch (error) {
        console.log("Não foi possível carregar produtos:", error?.message);
      }

      try {
        const cfg = await obterConfiguracoes();
        setConfig(cfg);
        setPayment(montarPagamento(cfg));
        if (cfg.logo_url) setLogo(cfg.logo_url);
      } catch (error) {
        console.log("Não foi possível carregar configurações:", error?.message);
      }

      try {
        const [c, a] = await Promise.all([listarClientes(), listarAnimais()]);
        setClientes(c || []);
        setAnimais(a || []);
      } catch (error) {
        console.log("Não foi possível carregar clientes/animais:", error?.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `fechamento-${client.name || "cliente"}`,
  });

  // No celular, o nome sugerido pro arquivo PDF vem do titulo da pagina (nao
  // do titulo do iframe de impressao acima, que so funciona no desktop).
  // Por isso mantemos o titulo da pagina sempre sincronizado com o cliente
  // -- em vez de so trocar no instante de imprimir, que e tarde demais: o
  // celular abre o menu de salvar/compartilhar de forma assincrona, e nesse
  // meio tempo o titulo ja tinha voltado ao original.
  useEffect(() => {
    const nome = client.name?.trim();
    document.title = nome ? `fechamento-${nome}` : "Fechamento Gustavo";

    return () => {
      document.title = "Fechamento Gustavo";
    };
  }, [client.name]);

  const money = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const totalMat = useMemo(() => {
    return materials.reduce((acc, item) => acc + calcularTotalMaterial(item, produtos), 0);
  }, [materials, produtos]);

  const totalSrv = useMemo(() => {
    return services.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      return acc + price;
    }, 0);
  }, [services]);

  const valorDescontoServico = useMemo(() => {
    if (!descontoServico.ativo) return 0;
    const v = Number(descontoServico.valor) || 0;
    const bruto = descontoServico.tipo === "percentual" ? (totalSrv * v) / 100 : v;
    return Math.min(Math.max(bruto, 0), totalSrv);
  }, [descontoServico, totalSrv]);

  const subtotal = totalMat + totalSrv;
  const desconto = valorDescontoServico;
  const acrescimo = Number(payment.addition) || 0;
  const totalGeral = subtotal - desconto + acrescimo;

  // Cliente cadastrado (com telefone) que bate com o nome digitado no
  // fechamento. So encontra quem o Gustavo ja cadastrou -- nao envia pra
  // ninguem de fora disso.
  const clienteSelecionado = useMemo(() => {
    const nome = client.name?.trim().toLowerCase();
    if (!nome) return null;
    return clientes.find((c) => c.nome?.trim().toLowerCase() === nome) || null;
  }, [clientes, client.name]);

  const mensagemWhatsapp = useMemo(() => {
    const linhas = [
      `Olá ${client.name || "tudo bem"}! Aqui é do consultório de ${config.nome || "Gustavo Andrade"}.`,
      "",
      `Segue o resumo do fechamento${client.animal ? ` do(a) ${client.animal}` : ""}:`,
    ];

    if (totalMat > 0) linhas.push(`Materiais: ${money(totalMat)}`);
    if (totalSrv > 0) linhas.push(`Serviços: ${money(totalSrv)}`);
    if (valorDescontoServico > 0) linhas.push(`Desconto: -${money(valorDescontoServico)}`);
    linhas.push(`Total: ${money(totalGeral)}`);
    linhas.push("");
    linhas.push(
      `Forma de pagamento: ${payment.method || "-"}${payment.status ? ` (${payment.status})` : ""}`
    );
    linhas.push("");
    linhas.push("Qualquer dúvida, estou à disposição!");

    return linhas.join("\n");
  }, [
    client.name,
    client.animal,
    config.nome,
    totalMat,
    totalSrv,
    valorDescontoServico,
    totalGeral,
    payment.method,
    payment.status,
  ]);

  const linkWhatsapp = useMemo(
    () =>
      montarLinkWhatsapp({
        telefone: clienteSelecionado?.telefone,
        mensagem: mensagemWhatsapp,
      }),
    [clienteSelecionado, mensagemWhatsapp]
  );

  const pixPayload = useMemo(() => {
    if (payment.method !== "pix") return "";
    if (!payment.pix) return "";

    return gerarPixCopiaECola({
      chave: payment.pix,
      nome: payment.favorecido,
      cidade: payment.cidade,
      valor: totalGeral,
      txid: payment.txid || "***",
      descricao: payment.descricaoPix || "Fechamento",
    });
  }, [
    payment.method,
    payment.pix,
    payment.favorecido,
    payment.cidade,
    payment.txid,
    payment.descricaoPix,
    totalGeral,
  ]);

  const getTodayISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const registrarFechamentoNoFinanceiro = async () => {
    if (financeiroRegistrado || totalGeral <= 0) {
      return;
    }

    const nomeCliente = client.name?.trim() || "Cliente";
    const animal = client.animal?.trim();
    const descricao = `Fechamento - ${nomeCliente}${animal ? ` / ${animal}` : ""}`;

    const itens = materials
      .filter((item) => item.produtoId)
      .map((item) => ({
        produtoId: item.produtoId,
        quantidade: Number(item.qtd) || 0,
        precoUnit: Number(item.price) || 0,
      }));

    const lancamento = {
      tipo: "entrada",
      descricao,
      valor: Number(totalGeral),
      forma_pagamento: payment.method || "pix",
      status_pagamento: "pendente",
      data_lancamento: getTodayISO(),
    };

    const snapshot = {
      clienteNome: nomeCliente,
      animalNome: animal || "",
      relatorio,
      materiais: materials.map((m) => ({
        desc: m.desc,
        qtd: m.qtd,
        price: m.price,
        total: calcularTotalMaterial(m, produtos),
      })),
      servicos: services.map((s) => ({ desc: s.desc, date: s.date, km: s.km, price: s.price })),
      pagamento: {
        ...payment,
        descontoServico: {
          ativo: descontoServico.ativo,
          tipo: descontoServico.tipo,
          valor: Number(descontoServico.valor) || 0,
          valorAbatido: valorDescontoServico,
        },
      },
    };

    const resultado = await processarFechamento({ lancamento, itens, snapshot });
    setFinanceiroRegistrado(true);
    setSalvoOffline(resultado.modo === "offline");
  };

  const handleSalvarPdf = async () => {
    if (salvandoPdfRef.current) return;

    salvandoPdfRef.current = true;
    setSalvandoPdf(true);

    try {
      if (!financeiroRegistrado && totalGeral > 0) {
        try {
          await registrarFechamentoNoFinanceiro();
        } catch (error) {
          console.error("Erro ao registrar fechamento no financeiro:", error);

          const continuar = window.confirm(
            "Não foi possível registrar o fechamento no financeiro. Deseja continuar gerando o PDF mesmo assim?"
          );

          if (!continuar) {
            return;
          }
        }
      }

      await onPrint?.();
    } finally {
      salvandoPdfRef.current = false;
      setSalvandoPdf(false);
    }
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const resetFechamento = () => {
    setClient({
      ...initialClient,
      date: new Date().toLocaleDateString("pt-BR"),
    });
    setRelatorio("");
    setMaterials([{ id: 1, desc: "", qtd: 1, price: 0, precoAuto: true }]);
    setServices([{ id: 1, desc: "", date: "", km: "", price: 0 }]);
    setDescontoServico(initialDesconto);
    setPayment(montarPagamento(config));
    setLogo(config.logo_url || logoPadrao);
    setFinanceiroRegistrado(false);
    setSalvoOffline(false);
    try {
      localStorage.removeItem(RASCUNHO_KEY);
    } catch {
      // ignora
    }
  };

  const updateMat = (id, key, value) => {
    setMaterials((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        // Ao escolher um produto do Estoque, ja sugere o Valor com base no
        // custo (qtd x custo pra ml/kg/l, ou so o custo por unidade pra
        // "un"). O Gustavo pode aumentar depois pra ganhar em cima.
        if (key === "produtoId") {
          const prod = produtos.find((p) => String(p.id) === String(value));
          const atualizado = { ...item, produtoId: value, desc: prod ? prod.nome : item.desc };

          if (prod && item.precoAuto !== false) {
            const custo = Number(prod.custo_medio) || 0;
            const qtd = Number(item.qtd) || 0;
            atualizado.price = ehUnidadeContavel(prod.unidade) ? custo : qtd * custo;
          }

          return atualizado;
        }

        // Se o item e por ml/kg/l, o Valor sugerido acompanha a Qtd digitada
        // (enquanto o Gustavo nao tiver editado o Valor na mao).
        if (key === "qtd") {
          const atualizado = { ...item, qtd: value };
          const prod = produtos.find((p) => String(p.id) === String(item.produtoId));

          if (prod && item.precoAuto !== false && !ehUnidadeContavel(prod.unidade)) {
            const custo = Number(prod.custo_medio) || 0;
            atualizado.price = (Number(value) || 0) * custo;
          }

          return atualizado;
        }

        // Assim que ele mexe no Valor na mao, para de preencher sozinho
        // nesse item.
        if (key === "price") {
          return { ...item, price: value, precoAuto: false };
        }

        return { ...item, [key]: value };
      })
    );
  };

  const addMat = () => {
    setMaterials((prev) => [
      ...prev,
      { id: Date.now(), desc: "", qtd: 1, price: 0, precoAuto: true },
    ]);
  };

  const delMat = (id) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSrv = (id, key, value) => {
    setServices((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (key === "km") {
          const novoItem = { ...item, km: value };
          if (value !== "") {
            const taxa = Number(config.valor_km) || 0;
            novoItem.price = Number(((Number(value) || 0) * taxa).toFixed(2));
          }
          return novoItem;
        }
        return { ...item, [key]: value };
      })
    );
  };

  const addSrv = () => {
    setServices((prev) => [...prev, { id: Date.now(), desc: "", date: "", km: "", price: 0 }]);
  };

  const delSrv = (id) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 md:pb-10">
      <div className="no-print pt-safe sticky top-0 z-50 mb-8 bg-slate-900 p-4 text-white shadow-lg">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
          <h1 className="text-xl font-bold">Gerador de Fechamento</h1>

          <div className="flex w-full flex-wrap justify-center gap-2 md:w-auto">
            <label className="flex cursor-pointer items-center gap-2 rounded bg-slate-700 px-3 py-2 text-sm font-medium transition hover:bg-slate-600">
              <FiUpload />
              {logo ? "Trocar logo" : "Adicionar logo"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleLogo}
              />
            </label>

            <button
              type="button"
              onClick={resetFechamento}
              className="flex items-center gap-2 rounded cursor-pointer bg-red-600 px-5 py-2 text-sm font-bold shadow-md transition hover:bg-red-400"
            >
              Limpar Fechamento
            </button>

            <button
              type="button"
              onClick={handleSalvarPdf}
              disabled={salvandoPdf}
              className="flex items-center gap-2 rounded cursor-pointer bg-green-600 px-5 py-2 text-sm font-bold shadow-md transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiPrinter />
              {salvandoPdf ? "GERANDO PDF..." : "SALVAR PDF"}
            </button>

            {linkWhatsapp ? (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded bg-emerald-600 px-5 py-2 text-sm font-bold shadow-md transition hover:bg-emerald-500"
              >
                <FiMessageCircle />
                ENVIAR POR WHATSAPP
              </a>
            ) : (
              client.name?.trim() && (
                <span
                  title={
                    clienteSelecionado
                      ? "Este cliente não tem telefone cadastrado."
                      : "Cliente não cadastrado. Cadastre em Clientes com o telefone."
                  }
                  className="flex cursor-not-allowed items-center gap-2 rounded bg-slate-700 px-5 py-2 text-sm font-bold text-slate-400 shadow-md"
                >
                  <FiMessageCircle />
                  SEM WHATSAPP
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {salvoOffline && (
          <div className="no-print mb-4 rounded-lg bg-amber-100 p-3 text-sm text-amber-800">
            Fechamento salvo no aparelho. Será enviado automaticamente quando houver internet.
          </div>
        )}
        <div
          ref={printRef}
          className="printable-area relative rounded-2xl border border-slate-200 bg-white p-6 shadow"
          style={{ colorScheme: "light", backgroundColor: "#ffffff", color: "#0f172a" }}
        >
          {logo && (
            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 0 }}
            >
              <img
                src={logo}
                alt="Marca d'água"
                className="w-[70%] max-w-[520px] object-contain opacity-[0.05] grayscale"
              />
            </div>
          )}

          <div className="relative" style={{ zIndex: 10 }}>
            <HeaderFechamento
              logo={logo}
              nome={config.nome}
              subtitulo={config.subtitulo}
              crmv={config.crmv}
              tituloDocumento="Fechamento de Conta"
              data={client.date}
            />

            <ClienteSection
              client={client}
              setClient={setClient}
              clientes={clientes}
              animais={animais}
            />

            <RelatorioSection
              value={relatorio}
              onChange={(e) => setRelatorio(e.target.value)}
            />

            <div className="mt-6 space-y-6">
              <ItensTable
                tipo="materiais"
                rows={materials}
                onAdd={addMat}
                onRemove={delMat}
                onUpdate={updateMat}
                subtotalValue={money(totalMat)}
                produtos={produtos}
              />

              <ItensTable
                tipo="servicos"
                rows={services}
                onAdd={addSrv}
                onRemove={delSrv}
                onUpdate={updateSrv}
                subtotalValue={money(totalSrv)}
                desconto={descontoServico}
                setDesconto={setDescontoServico}
                subtotalBruto={totalSrv}
                valorDesconto={valorDescontoServico}
              />
            </div>

            <div className="mt-8">
              <TotaisCard
                subtotal={subtotal}
                desconto={desconto}
                acrescimo={acrescimo}
                total={totalGeral}
              />
            </div>

            <PagamentoSection
              payment={payment}
              setPayment={setPayment}
              pixPayload={pixPayload}
              totalGeral={totalGeral}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
