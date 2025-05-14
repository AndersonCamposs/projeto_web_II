function excluirPassageiro(btn) {
  const id = btn.dataset.idExclusao;
  window.location.href = `/passageiros/delete/${id}`;
}
