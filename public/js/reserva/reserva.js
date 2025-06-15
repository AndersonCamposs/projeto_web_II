const CARD_BUSCA_VOO = document.querySelector('#cardBuscaVoo');
const CARD_BUSCA_PASSAGEIRO = document.querySelector('#cardBuscaPassageiro');
const CARD_RESERVA = document.querySelector('#cardReserva');
const BASE_URL = window.location.origin;

document.querySelector('#selectVooReserva').addEventListener('change', (e) => {
  const statusEscolhaVoo = document.querySelector('#statusEscolhaVoo');
  if (statusEscolhaVoo) {
    statusEscolhaVoo.classList.add('d-none');
  }

  CARD_BUSCA_PASSAGEIRO.classList.remove('d-none');
  document.querySelector('#idVoo').value = e.target.value;
});

document.querySelector('#btnBuscarPassageiro').addEventListener('click', async () => {
  const value = document.querySelector('#cpfInput').value;
  const cpf = value ? value : null;
  try {
    const res = await fetch(`${BASE_URL}/passageiros/search/${cpf}`);
    const json = await res.json();
    const msgRetornoBuscaPassageiro = document.querySelector('#msgRetornoBuscaPassageiro');
    let hasError = false;

    if (res.status === 400) {
      hasError = true;
    } else if (res.status === 404) {
      hasError = true;
    }

    if (!hasError) {
      document.querySelector('#statusBuscaPassageiro').classList.add('d-none');
      CARD_RESERVA.classList.remove('d-none');
      document.querySelector('#idPassageiro').value = json.passageiro._id;
    }

    document.querySelector('#statusBuscaPassageiro').classList.remove('d-none');
    msgRetornoBuscaPassageiro.innerHTML = json.mensagem;
  } catch (e) {
    console.log(e);
  }
});
