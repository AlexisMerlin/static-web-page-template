const btn = document.querySelector('#btn');

btn.addEventListener('click', () => {
  console.log('Funciona correctamente');
  btn.textContent = '¡Gracias!';
});