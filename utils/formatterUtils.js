function formatDate(date) {
  const d = new Date(date);
  return `${d.getUTCDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
}

function formatHour(date) {
  const d = new Date(date);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
}

/* retorna a data e hora de um objeto date no formato "dd/MM/yyyy, hh:mm"*/
function formatarDataHora(d) {
  const date = new Date(d);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(
      2,
      '0',
    )}/${date.getFullYear().toString()}, ${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
}

module.exports = { formatDate, formatHour, formatarDataHora };
