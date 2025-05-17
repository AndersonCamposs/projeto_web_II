function excluirVoo(btn) {
  const id = btn.dataset.idExclusao;
  window.location.href = `/voos/delete/${id}`;
}
