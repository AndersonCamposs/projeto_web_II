const cpfInput = document.querySelector('#cpfInput');
const telefoneInput = document.querySelector('#telefoneInput');

if (cpfInput) {
  cpfInput.addEventListener('input', (e) => {
    let cpf = e.target.value.replace(/\D/g, '');

    cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');

    e.target.value = cpf;
  });
}

if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let telefone = e.target.value.replace(/[^0-9]/g, '');

    if (telefone.length > 2) {
      telefone = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    }
    if (telefone.length > 10) {
      telefone = `(${telefone.slice(1, 3)}) ${telefone.slice(5, 10)}-${telefone.slice(10)}`;
    }

    e.target.value = telefone;
  });
}
