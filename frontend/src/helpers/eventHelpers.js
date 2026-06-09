function parseEventDateTime(evento) {
  if (!evento?.data) {
    return null;
  }

  const [dia, mes, ano] = String(evento.data).split("/").map(Number);

  if (!dia || !mes || !ano) {
    return null;
  }

  const horaTexto = String(evento.hora || "00:00").trim();
  const horaMatch = horaTexto.match(/^(\d{1,2})(?::|h)?(\d{0,2})?/i);
  const horas = Number(horaMatch?.[1] || 0);
  const minutos = Number(horaMatch?.[2] || 0);
  const dataHora = new Date(ano, mes - 1, dia, horas, minutos);

  if (
    Number.isNaN(dataHora.getTime()) ||
    dataHora.getDate() !== dia ||
    dataHora.getMonth() !== mes - 1 ||
    dataHora.getFullYear() !== ano
  ) {
    return null;
  }

  return dataHora;
}

function isSameDay(dataA, dataB) {
  return (
    dataA.getDate() === dataB.getDate() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getFullYear() === dataB.getFullYear()
  );
}

export function getProximoEvento(eventos, dataReferencia = new Date()) {
  const eventosValidos = Array.isArray(eventos) ? eventos : [];

  return (
    eventosValidos
      .map((evento) => ({
        evento,
        dataHora: parseEventDateTime(evento),
      }))
      .filter(({ dataHora }) => dataHora && dataHora >= dataReferencia)
      .sort((a, b) => a.dataHora.getTime() - b.dataHora.getTime())[0]
      ?.evento || null
  );
}

export function formatarDataHoraEvento(evento) {
  if (!evento) {
    return "";
  }

  if (evento.data && evento.hora) {
    return `${evento.data} às ${evento.hora}`;
  }

  return evento.data || evento.hora || "";
}

export function getEtiquetaProximoEvento(evento, dataReferencia = new Date()) {
  const dataHora = parseEventDateTime(evento);

  if (!dataHora) {
    return "Agenda";
  }

  const amanha = new Date(dataReferencia);
  amanha.setDate(dataReferencia.getDate() + 1);

  if (isSameDay(dataHora, dataReferencia)) {
    return "Hoje";
  }

  if (isSameDay(dataHora, amanha)) {
    return "Amanhã";
  }

  return "Agenda";
}
