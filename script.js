const celular = document.getElementById('celular');
const toggle = document.getElementById('toggleTheme');

toggle.addEventListener('click', () => {
  celular.classList.toggle('dark'); // alterna o tema

  if(celular.classList.contains('dark')){
    toggle.src = 'imagens/brilho-do-sol.png'; // ícone sol no dark mode
  } else {
    toggle.src = 'imagens/lua.png'; // ícone lua no modo claro
  }
});
