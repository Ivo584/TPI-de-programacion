// Datos de asignaturas
const asignaturas = [
  'Matemática',
  'Inglés Técnico',
  'Marco jurídico y derechos del trabajo',
  'Asistencia 2',
  'Autogestión',
  'Hardware 4',
  'Prácticas Profesionalizantes 2',
  'Programación',
  'Redes 3'
];

const selAsignatura = document.getElementById('sel-asignatura');
const selEstudiante  = document.getElementById('sel-estudiante');
const selCuatri      = document.getElementById('sel-cuatrimestre');
const selInforme     = document.getElementById('sel-tipo-informe');
const inpNota        = document.getElementById('inp-nota');
const inpFecha       = document.getElementById('inp-fecha');
const formNotas      = document.getElementById('form-notas');
const tablaNotas     = document.getElementById('tabla-ultimas-notas');
let editMode = null;

// Poblar select de asignaturas
asignaturas.forEach(materia => {
  const opt = document.createElement('option');
  opt.textContent = materia;
  selAsignatura.appendChild(opt);
});

// Gestionar pestañas
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('is-visible'));
    btn.classList.add('is-active');
    document.getElementById(btn.dataset.target).classList.add('is-visible');
  });
});

// Guardar o actualizar nota
formNotas.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    estudiante: selEstudiante.value,
    asignatura: selAsignatura.value,
    cuatrimestre: selCuatri.value,
    informe: selInforme.value,
    nota: inpNota.value,
    fecha: inpFecha.value
  };

  if (editMode !== null) {
    updateRow(editMode, data);
    editMode = null;
  } else {
    appendRow(data);
  }
  formNotas.reset();
});

// Barra de búsqueda de alumno
const searchAlumno = document.getElementById('search-alumno');
if (searchAlumno) {
  searchAlumno.addEventListener('input', function () {
    const filtro = this.value.trim().toLowerCase();
    Array.from(tablaNotas.children).forEach(tr => {
      const nombre = tr.children[0].textContent.toLowerCase();
      tr.style.display = nombre.includes(filtro) ? '' : 'none';
    });
  });
}

// Agregar fila a la tabla
function appendRow({ estudiante, asignatura, cuatrimestre, informe, nota, fecha }) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${estudiante}</td>
    <td>${asignatura}</td>
    <td>${cuatrimestre}</td>
    <td>${informe}</td>
    <td>${nota}</td>
    <td>${fecha}</td>
    <td>
      <button class="btn btn-primary btn-edit">Editar</button>
      <button class="btn btn-remove">Eliminar</button>
    </td>
  `;
  attachRowActions(tr);
  tablaNotas.prepend(tr);
}

// Enlazar acciones de editar y eliminar
function attachRowActions(tr) {
  tr.querySelector('.btn-remove').addEventListener('click', () => {
    tr.remove();
  });
  tr.querySelector('.btn-edit').addEventListener('click', () => {
    editMode = tr;
    selEstudiante.value  = tr.children[0].textContent;
    selAsignatura.value  = tr.children[1].textContent;
    selCuatri.value      = tr.children[2].textContent;
    selInforme.value     = tr.children[3].textContent;
    inpNota.value        = tr.children[4].textContent;
    inpFecha.value       = tr.children[5].textContent;
    document.querySelector('#form-notas .btn-primary').textContent = 'Actualizar';
    document.getElementById('cargar-notas')
      .classList.add('is-visible');
    document.querySelectorAll('.tab-btn')[1].click();
  });
}

// Actualizar datos en la fila existente
function updateRow(tr, { estudiante, asignatura, cuatrimestre, informe, nota, fecha }) {
  tr.children[0].textContent = estudiante;
  tr.children[1].textContent = asignatura;
  tr.children[2].textContent = cuatrimestre;
  tr.children[3].textContent = informe;
  tr.children[4].textContent = nota;
  tr.children[5].textContent = fecha;
  document.querySelector('#form-notas .btn-primary').textContent = 'Guardar';
}
