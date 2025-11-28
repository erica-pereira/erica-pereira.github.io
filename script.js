const FATOR_EMISSAO_SIN = 0.0385; // kg CO2 por kWh
const FATOR_KWH_POR_M3 = 0.67; // kWh por m³ de água
const ABSORCAO_ARVORE = 15.6; // kg CO2 por árvore/ano

function calcularPaybackSolar(custoInvestimento, geracaoKWhAnual, tarifaKWh) {
  const economiaAnual = geracaoKWhAnual * tarifaKWh;
  const paybackAnos = custoInvestimento / economiaAnual;
  return paybackAnos.toFixed(1);
}

function calcularCO2Solar(geracaoKWhAnual) {
  const co2Evitado = geracaoKWhAnual * FATOR_EMISSAO_SIN;
  return co2Evitado.toFixed(0);
}

function calcularPaybackAgua(custoInvestimento, volumeM3Anual, tarifaAguaEsgoto) {
  const economiaAnual = volumeM3Anual * tarifaAguaEsgoto;
  const paybackAnos = custoInvestimento / economiaAnual;
  return paybackAnos.toFixed(1);
}

function calcularCO2Agua(volumeM3Anual) {
  const kwhEconomizado = volumeM3Anual * FATOR_KWH_POR_M3;
  const co2Evitado = kwhEconomizado * FATOR_EMISSAO_SIN;
  return co2Evitado.toFixed(0);
}

function calcularLed(
  wattsAntigo,
  wattsNovo,
  quantidade,
  horasDia,
  custoKit,
  tarifaEnergia,
) {
  const diferencaWatts = (wattsAntigo - wattsNovo) * quantidade;
  const kwhEconomizado = (diferencaWatts * horasDia * 365) / 1000;
  const economiaReais = kwhEconomizado * tarifaEnergia;
  const paybackAnos = custoKit / economiaReais;
  const co2Evitado = kwhEconomizado * FATOR_EMISSAO_SIN;

  return {
    economiaAnual: economiaReais.toFixed(2),
    paybackAnos: paybackAnos.toFixed(1),
    co2Evitado,
  };
}

function calcularArvores(co2Total) {
  const arvores = co2Total / ABSORCAO_ARVORE;
  return Math.ceil(arvores);
}

function calcularVazaoAgua(
  vazaoAntigaLMin,
  vazaoNovaLMin,
  minutosUsoDia,
  custoPeca,
  tarifaAguaEsgoto,
) {
  const LITROS_POR_M3 = 1000;
  const diferencaVazao = vazaoAntigaLMin - vazaoNovaLMin;
  const litrosEconomizadosAno = diferencaVazao * minutosUsoDia * 365;
  const m3EconomizadosAno = litrosEconomizadosAno / LITROS_POR_M3;
  const economiaFinanceira = m3EconomizadosAno * tarifaAguaEsgoto;
  const paybackAnos = custoPeca / economiaFinanceira;

  return {
    m3EconomizadosAno: m3EconomizadosAno.toFixed(2),
    economiaAnual: economiaFinanceira.toFixed(2),
    paybackAnos: paybackAnos.toFixed(1),
  };
}

const form = document.getElementById("sustentabilidade-form");
const paybackSolarOutput = document.getElementById("paybackSolar");
const co2SolarOutput = document.getElementById("co2Solar");
const paybackAguaOutput = document.getElementById("paybackAgua");
const co2AguaOutput = document.getElementById("co2Agua");
const paybackAeradorOutput = document.getElementById("paybackAerador");
const aguaAeradorOutput = document.getElementById("aguaAerador");
const economiaAeradorOutput = document.getElementById("economiaAerador");
const paybackLedOutput = document.getElementById("paybackLed");
const co2LedOutput = document.getElementById("co2Led");
const economiaLedOutput = document.getElementById("economiaLed");
const co2TotalOutput = document.getElementById("co2Total");
const arvoresEquivalenciaOutput = document.getElementById("arvoresEquivalencia");
const cardSolar = document.getElementById("resultado-solar");
const cardAgua = document.getElementById("resultado-agua");
const cardAerador = document.getElementById("resultado-aerador");
const cardLed = document.getElementById("resultado-led");
const custoSolarInput = document.getElementById("custoSolar");
const geracaoSolarInput = document.getElementById("geracaoSolar");
const tarifaSolarInput = document.getElementById("tarifaSolar");
const custoAguaInput = document.getElementById("custoAgua");
const volumeAguaInput = document.getElementById("volumeAgua");
const tarifaAguaInput = document.getElementById("tarifaAgua");
const vazaoAntigaInput = document.getElementById("vazaoAntiga");
const vazaoNovaInput = document.getElementById("vazaoNova");
const minutosUsoInput = document.getElementById("minutosUso");
const custoPecaInput = document.getElementById("custoPeca");
const tarifaAeradorInput = document.getElementById("tarifaAerador");
const wattsAntigoInput = document.getElementById("wattsAntigo");
const wattsNovoInput = document.getElementById("wattsNovo");
const quantidadeLampadasInput = document.getElementById("quantidadeLampadas");
const horasUsoInput = document.getElementById("horasUso");
const custoKitInput = document.getElementById("custoKit");
const tarifaLedInput = document.getElementById("tarifaLed");
const btnCalcularSolar = document.getElementById("calcularSolar");
const btnCalcularAgua = document.getElementById("calcularAgua");
const btnCalcularAerador = document.getElementById("calcularAerador");
const btnCalcularLed = document.getElementById("calcularLed");

let paybackSolarEstado = null;
let paybackAguaEstado = null;
let paybackAeradorEstado = null;
let paybackLedEstado = null;
let co2SolarEstado = null;
let co2AguaEstado = null;
let co2LedEstado = null;

const feedback = document.createElement("p");
feedback.id = "formFeedback";
feedback.className = "form-feedback";
feedback.hidden = true;
form.append(feedback);

btnCalcularSolar.addEventListener("click", () => {
  const custoSolar = Number(custoSolarInput.value);
  const geracaoSolar = Number(geracaoSolarInput.value);
  const tarifaSolar = Number(tarifaSolarInput.value);

  const valoresSolar = [custoSolar, geracaoSolar, tarifaSolar];

  if (valoresSolar.some((valor) => Number.isNaN(valor) || valor <= 0)) {
    resetResultadosSolar();
    mostrarFeedback(
      "Revise os campos de energia solar: preencha com números positivos.",
      false,
    );
    return;
  }

  const paybackSolar = calcularPaybackSolar(
    custoSolar,
    geracaoSolar,
    tarifaSolar,
  );
  const co2Solar = calcularCO2Solar(geracaoSolar);

  paybackSolarOutput.textContent = formatarAnos(paybackSolar);
  co2SolarOutput.textContent = formatarKg(co2Solar);
  paybackSolarEstado = parseFloat(paybackSolar);
  co2SolarEstado = Number(co2Solar);

  mostrarFeedback("Resultados de energia solar atualizados.", true);
  atualizarDestaque();
  atualizarEquivalenciaArvores();
});

btnCalcularAgua.addEventListener("click", () => {
  const custoAgua = Number(custoAguaInput.value);
  const volumeAgua = Number(volumeAguaInput.value);
  const tarifaAgua = Number(tarifaAguaInput.value);

  const valoresAgua = [custoAgua, volumeAgua, tarifaAgua];

  if (valoresAgua.some((valor) => Number.isNaN(valor) || valor <= 0)) {
    resetResultadosAgua();
    mostrarFeedback(
      "Revise os campos de reúso de água: use números positivos.",
      false,
    );
    return;
  }

  const paybackAgua = calcularPaybackAgua(custoAgua, volumeAgua, tarifaAgua);
  const co2Agua = calcularCO2Agua(volumeAgua);

  paybackAguaOutput.textContent = formatarAnos(paybackAgua);
  co2AguaOutput.textContent = formatarKg(co2Agua);
  paybackAguaEstado = parseFloat(paybackAgua);
  co2AguaEstado = Number(co2Agua);

  mostrarFeedback("Resultados de reúso de água atualizados.", true);
  atualizarDestaque();
  atualizarEquivalenciaArvores();
});

btnCalcularAerador.addEventListener("click", () => {
  const vazaoAntiga = Number(vazaoAntigaInput.value);
  const vazaoNova = Number(vazaoNovaInput.value);
  const minutosUso = Number(minutosUsoInput.value);
  const custoPeca = Number(custoPecaInput.value);
  const tarifaAerador = Number(tarifaAeradorInput.value);

  const valoresAerador = [
    vazaoAntiga,
    vazaoNova,
    minutosUso,
    custoPeca,
    tarifaAerador,
  ];

  if (
    valoresAerador.some((valor) => Number.isNaN(valor) || valor <= 0) ||
    vazaoNova >= vazaoAntiga
  ) {
    resetResultadosAerador();
    mostrarFeedback(
      "Revise os campos de aeradores: vazões devem ser positivas e a vazão nova menor que a atual.",
      false,
    );
    return;
  }

  const resultadoAerador = calcularVazaoAgua(
    vazaoAntiga,
    vazaoNova,
    minutosUso,
    custoPeca,
    tarifaAerador,
  );

  paybackAeradorOutput.textContent = formatarAnos(resultadoAerador.paybackAnos);
  aguaAeradorOutput.textContent = formatarM3(resultadoAerador.m3EconomizadosAno);
  economiaAeradorOutput.textContent = formatarDinheiro(resultadoAerador.economiaAnual);
  paybackAeradorEstado = parseFloat(resultadoAerador.paybackAnos);

  mostrarFeedback("Resultados de aeradores atualizados.", true);
  atualizarDestaque();
});

btnCalcularLed.addEventListener("click", () => {
  const wattsAntigo = Number(wattsAntigoInput.value);
  const wattsNovo = Number(wattsNovoInput.value);
  const quantidade = Number(quantidadeLampadasInput.value);
  const horasDia = Number(horasUsoInput.value);
  const custoKit = Number(custoKitInput.value);
  const tarifaEnergia = Number(tarifaLedInput.value);

  const valoresLed = [
    wattsAntigo,
    wattsNovo,
    quantidade,
    horasDia,
    custoKit,
    tarifaEnergia,
  ];

  if (
    valoresLed.some((valor) => Number.isNaN(valor) || valor <= 0) ||
    wattsNovo >= wattsAntigo
  ) {
    resetResultadosLed();
    mostrarFeedback(
      "Revise os campos de LED: insira números positivos e garanta que a potência LED seja menor que a atual.",
      false,
    );
    return;
  }

  const resultadoLed = calcularLed(
    wattsAntigo,
    wattsNovo,
    quantidade,
    horasDia,
    custoKit,
    tarifaEnergia,
  );

  paybackLedOutput.textContent = formatarAnos(resultadoLed.paybackAnos);
  co2LedOutput.textContent = formatarKg(resultadoLed.co2Evitado);
  economiaLedOutput.textContent = formatarDinheiro(resultadoLed.economiaAnual);
  paybackLedEstado = parseFloat(resultadoLed.paybackAnos);
  co2LedEstado = resultadoLed.co2Evitado;

  mostrarFeedback("Resultados de iluminação LED atualizados.", true);
  atualizarDestaque();
  atualizarEquivalenciaArvores();
});

function mostrarFeedback(mensagem, sucesso) {
  feedback.textContent = mensagem;
  feedback.hidden = false;
  feedback.classList.toggle("form-feedback--success", sucesso);
  feedback.classList.toggle("form-feedback--error", !sucesso);
}

function resetResultadosSolar() {
  paybackSolarOutput.textContent = "-";
  co2SolarOutput.textContent = "-";
  paybackSolarEstado = null;
  atualizarDestaque();
  co2SolarEstado = null;
  atualizarEquivalenciaArvores();
}

function resetResultadosAgua() {
  paybackAguaOutput.textContent = "-";
  co2AguaOutput.textContent = "-";
  paybackAguaEstado = null;
  atualizarDestaque();
  co2AguaEstado = null;
  atualizarEquivalenciaArvores();
}

function resetResultadosAerador() {
  paybackAeradorOutput.textContent = "-";
  aguaAeradorOutput.textContent = "-";
  economiaAeradorOutput.textContent = "-";
  paybackAeradorEstado = null;
  atualizarDestaque();
}

function resetResultadosLed() {
  paybackLedOutput.textContent = "-";
  co2LedOutput.textContent = "-";
  economiaLedOutput.textContent = "-";
  paybackLedEstado = null;
  co2LedEstado = null;
  atualizarDestaque();
  atualizarEquivalenciaArvores();
}

function formatarAnos(valor) {
  return `${Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} anos`;
}

function formatarKg(valor) {
  return `${Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} kg`;
}

function formatarM3(valor) {
  return `${Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} m³`;
}

function formatarDinheiro(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

function atualizarEquivalenciaArvores() {
  const co2Valores = [co2SolarEstado, co2AguaEstado, co2LedEstado].filter(
    (valor) => Number.isFinite(valor) && valor > 0,
  );

  if (co2Valores.length === 0) {
    co2TotalOutput.textContent = "-";
    arvoresEquivalenciaOutput.textContent = "-";
    return;
  }

  const co2Total = co2Valores.reduce((soma, valor) => soma + valor, 0);
  const arvores = calcularArvores(co2Total);

  co2TotalOutput.textContent = formatarKg(co2Total);
  const textoArvores = arvores === 1 ? "1 árvore" : `${arvores} árvores`;
  arvoresEquivalenciaOutput.textContent = textoArvores;
}

// Destaca a alternativa com retorno mais rápido.
function atualizarDestaque() {
  cardSolar.classList.remove("card--highlight");
  cardAgua.classList.remove("card--highlight");
  cardAerador.classList.remove("card--highlight");
  if (cardLed) {
    cardLed.classList.remove("card--highlight");
  }

  const candidatos = [
    { valor: paybackSolarEstado, card: cardSolar },
    { valor: paybackAguaEstado, card: cardAgua },
    { valor: paybackAeradorEstado, card: cardAerador },
    { valor: paybackLedEstado, card: cardLed },
  ].filter(({ valor }) => Number.isFinite(valor) && valor > 0);

  if (candidatos.length < 2) {
    return;
  }

  const melhor = candidatos.reduce((menor, item) =>
    item.valor < menor.valor ? item : menor,
  candidatos[0]);

  const existeEmpate = candidatos.some(
    (item) => item !== melhor && item.valor === melhor.valor,
  );

  if (existeEmpate) {
    return;
  }

  melhor.card.classList.add("card--highlight");
}