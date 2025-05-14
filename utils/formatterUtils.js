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

module.exports = { formatDate, formatHour };
