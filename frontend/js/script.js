// Cambiar entre pestañas
function mostrarTab(id) {
  document.querySelectorAll('.tab').forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// Datos de ejemplo
const estudiantes = [
  { id: 1, nombre: 'Ana Pérez' },
  { id: 2, nombre: 'Juan L.' }
];

const asignaturas = [
  { id: 1, nombre: 'Matemática' },
  { id: 2, nombre: 'Historia' }
];

let notas = [
  { id: 1, estudianteId: 1, asignaturaId: 1, nota: 8.5, fecha: '2023-05-01' }
];

const solicitudes = [
  { id: 1, usuario: 'Juan L.', email: 'juan@ejemplo.com', fecha: '2025-08-03' }
];

const usuariosActivos = [
  { id: 2, usuario: 'María S.', rol: 'Departamento', estado: 'Activo' }
];

// Renderizar estudiante
function cargarNotasRecientes() {
  const tbody = document.getElementById('notas-recientes');
  if (!tbody) return; // <-- Previene error si el elemento no existe
  tbody.innerHTML = '';
  notas.forEach(n => {
    const asig = asignaturas.find(a => a.id === n.asignaturaId).nombre;
    tbody.innerHTML += `<tr><td>${asig}</td><td>${n.nota}</td><td>${n.fecha}</td></tr>`;
  });
}

// Renderizar departamento
function cargarFormYDashboard() {
  const selEst = document.getElementById('sel-estudiante');
  const selAsig = document.getElementById('sel-asignatura');
  if (!selEst || !selAsig) return; // <-- Previene error si los elementos no existen
  estudiantes.forEach(e => selEst.innerHTML += `<option value="${e.id}">${e.nombre}</option>`);
  asignaturas.forEach(a => selAsig.innerHTML += `<option value="${a.id}">${a.nombre}</option>`);

  document.getElementById('form-notas').addEventListener('submit', e => {
    e.preventDefault();
    const estId = +selEst.value;
    const asigId = +selAsig.value;
    const nota = +document.getElementById('inp-nota').value;
    const fecha = document.getElementById('inp-fecha').value;
    notas.push({ id: notas.length+1, estudianteId: estId, asignaturaId: asigId, nota, fecha });
    cargarUltimasNotas();
    alert('Nota guardada');
  });

  cargarUltimasNotas();
}

function cargarUltimasNotas() {
  const tbody = document.getElementById('tabla-ultimas-notas');
  if (!tbody) return; // <-- Previene error si el elemento no existe
  tbody.innerHTML = '';
  notas.slice(-5).forEach(n => {
    const est = estudiantes.find(e => e.id === n.estudianteId).nombre;
    const asig = asignaturas.find(a => a.id === n.asignaturaId).nombre;
    tbody.innerHTML += `<tr><td>${est}</td><td>${asig}</td><td>${n.nota}</td><td>${n.fecha}</td></tr>`;
  });
}

// Renderizar admin
function cargarSolicitudesYActivos() {
  const tp = document.getElementById('tabla-pendientes');
  const ta = document.getElementById('tabla-activos');
  if (tp) {
    solicitudes.forEach(s => {
      tp.innerHTML += `<tr>
        <td>${s.usuario}</td><td>${s.email}</td><td>${s.fecha}</td>
        <td><button>A</button><button>R</button></td>
      </tr>`;
    });
  }
  if (ta) {
    usuariosActivos.forEach(u => {
      ta.innerHTML += `<tr>
        <td>${u.usuario}</td><td>${u.rol}</td><td>${u.estado}</td>
        <td><button>Editar</button><button>Borrar</button></td>
      </tr>`;
    });
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  cargarNotasRecientes();
  cargarFormYDashboard();
  cargarSolicitudesYActivos();
});

// Al producirse el evento DOMContentLoaded, poblar selects y configurar formulario
document.addEventListener('DOMContentLoaded', () => {
  const selEstudiante = document.getElementById('sel-estudiante');
  const selAsignatura = document.getElementById('sel-asignatura');
  const selTipoInforme = document.getElementById('sel-tipo-informe');
  const tablaNotas = document.getElementById('tabla-ultimas-notas');
  const formNotas = document.getElementById('form-notas');

  // Datos de ejemplo; reemplazar con fetch/ajax si procede
  const estudiantes = ['Ana Pérez', 'Luis Gómez', 'María Díaz'];
  const asignaturas = ['Matemáticas', 'Historia', 'Biología'];
  const tiposInforme = [
    { value: '1er-informe', text: '1er Informe' },
    { value: '2do-informe', text: '2do Informe' },
    { value: 'final-1er-cuatrimestre', text: 'Nota Final 1er Cuatrimestre' },
    { value: 'final-2do-cuatrimestre', text: 'Nota Final 2do Cuatrimestre' }
  ];

  // Función auxiliar para poblar un <select>
  function poblarSelect(selectEl, opciones) {
    opciones.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.value || opt;
      option.textContent = opt.text || opt;
      selectEl.appendChild(option);
    });
  }

  // Llenamos los selects
  poblarSelect(selEstudiante, estudiantes);
  poblarSelect(selAsignatura, asignaturas);
  poblarSelect(selTipoInforme, tiposInforme);

  // Handler envío del formulario
  formNotas.addEventListener('submit', event => {
    event.preventDefault();

    // Leer valores
    const estudiante = selEstudiante.value;
    const asignatura = selAsignatura.value;
    const tipoInforme = selTipoInforme.selectedOptions[0].textContent;
    const nota = document.getElementById('inp-nota').value;
    const fecha = document.getElementById('inp-fecha').value;

    // Validar campos mínimos
    if (!estudiante || !asignatura || !tipoInforme || !nota || !fecha) {
      alert('Complete todos los campos antes de guardar.');
      return;
    }

    // Crear fila e inyectar datos
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${estudiante}</td>
      <td>${asignatura}</td>
      <td>${tipoInforme}</td>
      <td>${nota}</td>
      <td>${fecha}</td>
    `;
    tablaNotas.prepend(tr);  // Insertar al principio de la tabla

    // Reiniciar formulario
    formNotas.reset();
  });
});

// Función para alternar pestañas (dashboard / cargar-notas)
function mostrarTab(id) {
  document.querySelectorAll('.tab').forEach(sec => {
    sec.style.display = sec.id === id ? 'block' : 'none';
  });
}

