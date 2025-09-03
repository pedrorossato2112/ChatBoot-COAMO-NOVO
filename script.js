const app = document.getElementById('app');
const toggle = document.getElementById('toggleTheme');
const solIcon = document.getElementById('solIcon');

toggle.addEventListener('click', () => {
  app.classList.toggle('dark');

  if(app.classList.contains('dark')){
    toggle.src = 'images/brilho-do-sol.png'; // ícone sol no dark mode
  } else {
    toggle.src = 'images/lua.png'; // volta para a lua no modo claro
  }
});
