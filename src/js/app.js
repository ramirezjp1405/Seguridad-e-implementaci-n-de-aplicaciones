document.getElementById('contacto').addEventListener('submit', function (e) {
  e.preventDefault();
  var nombre = document.getElementById('nombre').value.trim();
  var correo = document.getElementById('correo').value.trim();
  var mensaje = document.getElementById('mensaje');

  var nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,50}$/.test(nombre);
  var correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  if (!nombreValido) {
    mensaje.textContent = 'Nombre inválido: solo letras y espacios (2 a 50).';
  } else if (!correoValido) {
    mensaje.textContent = 'Correo inválido.';
  } else {
    mensaje.textContent = 'Datos válidos (demostración, no se envía nada).';
  }
});
