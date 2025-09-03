const celular = document.getElementById('celular');
const toggle = document.getElementById('toggleTheme');
const solIcon = document.getElementById('solIcon');

toggle.addEventListener('click', () => {
  celular.classList.toggle('dark');

  if(celular.classList.contains('dark')){
    toggle.src = 'imagens/brilho-do-sol.png'; 
  } else {
    toggle.src = 'imagens/lua.png'; 
  }
});

