const CARD_BUSCA_VOO = document.querySelector('#cardBuscaVoo');
const CARD_BUSCA_PASSAGEIRO = document.querySelector('#cardBuscaPassageiro');
const CARD_RESERVA = document.querySelector('#cardReserva');

document.querySelector('#selectVooReserva').addEventListener('change', (e) => {
  const statusEscolhaVoo = document.querySelector('#statusEscolhaVoo');
  statusEscolhaVoo.classList.add('d-none');
  CARD_BUSCA_PASSAGEIRO.classList.remove('d-none');
  document.querySelector('#idVoo').value = e.target.value;
});

document.querySelector('#btnBuscarPassageiro').addEventListener('click', async () => {
  const value = document.querySelector('#cpfInput').value;
  const cpf = value ? value : null;
  try {
    const res = await fetch(`http://localhost:5500/passageiros/search/${cpf}`);
    const json = await res.json();
    if (res.status === 404) {
      document.querySelector('#statusBuscaPassageiro').classList.remove('d-none');
    } else {
      document.querySelector('#statusBuscaPassageiro').classList.add('d-none');
      CARD_RESERVA.classList.remove('d-none');
      document.querySelector('#idPassageiro').value = json._id;
    }
  } catch (e) {
    console.log(e);
  }
});

function excluirReserva(btn) {
  const id = btn.dataset.idExclusao;
  window.location.href = `/reservas/delete/${id}`;
}
