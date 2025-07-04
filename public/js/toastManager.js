const s = document.querySelector('#status');
const statusToast = document.querySelector('#statusToast');
const toastHeader = statusToast.querySelector('.toast-header');

let toastTitle = '';
let toastBodyContent = '';
let toastStyle = '';

document.addEventListener('DOMContentLoaded', () => {
  if (s.value == '1') {
    toastTitle = 'Adicionado com sucesso';
    toastBodyContent = 'O registro foi adicionado com sucesso.';
    toastStyle = 'text-success';
  } else if (s.value == '2') {
    toastTitle = 'Removido com sucesso';
    toastBodyContent = 'O registro foi removido com sucesso.';
    toastStyle = 'text-danger';
  } else if (s.value == '3') {
    toastTitle = 'Atualizado com sucesso';
    toastBodyContent = 'O registro foi atualizado com sucesso.';
    toastStyle = 'text-primary';
  } else {
    return;
  }

  statusToast.querySelector('#toast-title').innerHTML = toastTitle;
  statusToast.querySelector('#toast-body-content').innerHTML = toastBodyContent;
  statusToast.querySelector('.toast-header').className = `toast-header ${toastStyle}`;

  const toast = bootstrap.Toast.getOrCreateInstance(statusToast, {
    delay: 6000,
  });
  toast.show();
});
