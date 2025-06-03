function excluirUsuario(btn) {
  const id = btn.dataset.idExclusao;
  window.location.href = `/usuarios/delete/${id}`;
}
