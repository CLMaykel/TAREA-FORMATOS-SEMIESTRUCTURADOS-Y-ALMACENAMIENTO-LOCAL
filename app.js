// Expresiones Regulares para validación
const REGEX = {
  cedula: /^\d{10}$/,
  nombres: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  apellidos: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  direccion: /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\.\,\#-]{5,100}$/,
  telefono: /^09\d{8}$/,
  correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  paralelo: /^[a-zA-Z0-9]{1,2}$/
};

// Referencias del DOM
const form = document.getElementById('studentForm');
const listaEstudiantes = document.getElementById('listaEstudiantes');

// Cargar registros al iniciar la página
document.addEventListener('DOMContentLoaded', cargarEstudiantes);

// Evento Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (validarFormulario()) {
    const nuevoEstudiante = {
      cedula: document.getElementById('cedula').value.trim(),
      apellidos: document.getElementById('apellidos').value.trim(),
      nombres: document.getElementById('nombres').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      correo: document.getElementById('correo').value.trim(),
      facultad: document.getElementById('facultad').value,
      nivel: document.getElementById('nivel').value,
      paralelo: document.getElementById('paralelo').value.trim().toUpperCase()
    };

    guardarEstudiante(nuevoEstudiante);
    form.reset();
    limpiarClasesValidacion();
    cargarEstudiantes();
  }
});

// Validación campo por campo
function validarCampo(fieldId, regex, errorMsg) {
  const input = document.getElementById(fieldId);
  const errorSpan = document.getElementById(`error-${fieldId}`);
  const val = input.value.trim();

  if (!val) {
    input.classList.add('is-invalid');
    errorSpan.textContent = 'Este campo es obligatorio.';
    return false;
  }

  if (regex && !regex.test(val)) {
    input.classList.add('is-invalid');
    errorSpan.textContent = errorMsg;
    return false;
  }

  input.classList.remove('is-invalid');
  errorSpan.textContent = '';
  return true;
}

// Validación global
function validarFormulario() {
  let esValido = true;

  esValido &= validarCampo('cedula', REGEX.cedula, 'Debe contener exactamente 10 dígitos.');
  esValido &= validarCampo('apellidos', REGEX.apellidos, 'Solo se permiten letras (mín. 2 caracteres).');
  esValido &= validarCampo('nombres', REGEX.nombres, 'Solo se permiten letras (mín. 2 caracteres).');
  esValido &= validarCampo('direccion', REGEX.direccion, 'Dirección inválida (mín. 5 caracteres).');
  esValido &= validarCampo('telefono', REGEX.telefono, 'Debe empezar por 09 y tener 10 dígitos.');
  esValido &= validarCampo('correo', REGEX.correo, 'Ingrese un formato de correo válido.');
  esValido &= validarCampo('facultad', null, '');
  esValido &= validarCampo('nivel', null, '');
  esValido &= validarCampo('paralelo', REGEX.paralelo, 'Máximo 2 caracteres alfanuméricos.');

  // Validar duplicado de cédula
  if (esValido) {
    const cedulaVal = document.getElementById('cedula').value.trim();
    const estudiantes = obtenerEstudiantes();
    const existe = estudiantes.some(est => est.cedula === cedulaVal);

    if (existe) {
      document.getElementById('cedula').classList.add('is-invalid');
      document.getElementById('error-cedula').textContent = 'La cédula ya se encuentra registrada.';
      esValido = false;
    }
  }

  return Boolean(esValido);
}

// Operaciones con localStorage & JSON
function obtenerEstudiantes() {
  const data = localStorage.getItem('estudiantes');
  return data ? JSON.parse(data) : [];
}

function guardarEstudiante(estudiante) {
  const estudiantes = obtenerEstudiantes();
  estudiantes.push(estudiante);
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
}

function eliminarEstudiante(cedula) {
  let estudiantes = obtenerEstudiantes();
  estudiantes = estudiantes.filter(est => est.cedula !== cedula);
  localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
  cargarEstudiantes();
}

// Renderizado en tabla
function cargarEstudiantes() {
  const estudiantes = obtenerEstudiantes();
  listaEstudiantes.innerHTML = '';

  if (estudiantes.length === 0) {
    listaEstudiantes.innerHTML = `<tr><td colspan="8" style="text-align: center;">No hay estudiantes registrados.</td></tr>`;
    return;
  }

  estudiantes.forEach(est => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${est.cedula}</td>
      <td>${est.apellidos} ${est.nombres}</td>
      <td>${est.telefono}</td>
      <td>${est.correo}</td>
      <td>${est.facultad}</td>
      <td>${est.nivel}°</td>
      <td>${est.paralelo}</td>
      <td>
        <button class="btn-delete" onclick="eliminarEstudiante('${est.cedula}')">Eliminar</button>
      </td>
    `;
    listaEstudiantes.appendChild(tr);
  });
}

function limpiarClasesValidacion() {
  document.querySelectorAll('input, select').forEach(el => el.classList.remove('is-invalid'));
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}