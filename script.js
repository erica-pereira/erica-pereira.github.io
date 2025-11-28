const FATOR_EMISSAO_SIN = 0.0385; // kg CO2 por kWh
const FATOR_KWH_POR_M3 = 0.67; // kWh por m³ de água

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

const form = document.getElementById("sustentabilidade-form");
const paybackSolarOutput = document.getElementById("paybackSolar");
const co2SolarOutput = document.getElementById("co2Solar");
const paybackAguaOutput = document.getElementById("paybackAgua");
const co2AguaOutput = document.getElementById("co2Agua");
const cardSolar = document.getElementById("resultado-solar");
const cardAgua = document.getElementById("resultado-agua");

const feedback = document.createElement("p");
feedback.id = "formFeedback";
feedback.className = "form-feedback";
feedback.hidden = true;
form.append(feedback);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const custoSolar = Number(document.getElementById("custoSolar").value);
  const geracaoSolar = Number(document.getElementById("geracaoSolar").value);
  const tarifaSolar = Number(document.getElementById("tarifaSolar").value);
  const custoAgua = Number(document.getElementById("custoAgua").value);
  const volumeAgua = Number(document.getElementById("volumeAgua").value);
  const tarifaAgua = Number(document.getElementById("tarifaAgua").value);

  const valores = [
    custoSolar,
    geracaoSolar,
    tarifaSolar,
    custoAgua,
    volumeAgua,
    tarifaAgua,
  ];

  if (valores.some((valor) => Number.isNaN(valor) || valor <= 0)) {
    resetResultados();
    mostrarFeedback(
      "Revise os campos: use apenas números positivos para o cálculo.",
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
  const paybackAgua = calcularPaybackAgua(custoAgua, volumeAgua, tarifaAgua);
  const co2Agua = calcularCO2Agua(volumeAgua);

  paybackSolarOutput.textContent = formatarAnos(paybackSolar);
  co2SolarOutput.textContent = formatarKg(co2Solar);
  paybackAguaOutput.textContent = formatarAnos(paybackAgua);
  co2AguaOutput.textContent = formatarKg(co2Agua);

  destacarMelhorPayback(
    parseFloat(paybackSolar),
    parseFloat(paybackAgua),
  );
  mostrarFeedback("Resultados atualizados. Compare as opções abaixo.", true);
});

function mostrarFeedback(mensagem, sucesso) {
  feedback.textContent = mensagem;
  feedback.hidden = false;
  feedback.classList.toggle("form-feedback--success", sucesso);
  feedback.classList.toggle("form-feedback--error", !sucesso);
}

function resetResultados() {
  paybackSolarOutput.textContent = "-";
  co2SolarOutput.textContent = "-";
  paybackAguaOutput.textContent = "-";
  co2AguaOutput.textContent = "-";
  cardSolar.classList.remove("card--highlight");
  cardAgua.classList.remove("card--highlight");
}

function formatarAnos(valor) {
  return `${Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} anos`;
}

function formatarKg(valor) {
  return `${Number(valor).toLocaleString("pt-BR")} kg`;
}

// Destaca a alternativa com retorno mais rápido.
function destacarMelhorPayback(paybackSolar, paybackAgua) {
  cardSolar.classList.remove("card--highlight");
  cardAgua.classList.remove("card--highlight");

  if (!Number.isFinite(paybackSolar) || !Number.isFinite(paybackAgua)) {
    return;
  }

  if (paybackSolar === paybackAgua) {
    return;
  }

  const cardComMelhorRetorno =
    paybackSolar < paybackAgua ? cardSolar : cardAgua;

  cardComMelhorRetorno.classList.add("card--highlight");
}

``