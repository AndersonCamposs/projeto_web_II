function excluirReserva(btn) {
  const id = btn.dataset.idExclusao;
  window.location.href = `/reservas/delete/${id}`;
}
