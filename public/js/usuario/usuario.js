function excluirUsuario(btn) {
  const cod = btn.dataset.codExclusao;
  window.location.href = `/usuarios/delete/${cod}`;
}
