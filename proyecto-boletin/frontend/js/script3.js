// --- Carga de notas para departamento.html ---
// Backend base
const API_BASE = 'http://localhost:3002';

// Llenar selects de estudiantes y asignaturas
async function cargarSelectsNotas() {
  const selEst = document.getElementById('sel-estudiante');
  selEst.innerHTML = '<option value="">-- Seleccionar --</option>';
  try {
    const res = await fetch(`${API_BASE}/api/estudiantes`);
    const data = await res.json();
    data.forEach(u => {
      const opt = document.createElement('option');
      
      opt.value = u.email;
      
      const cursoStr = `[${u.curso || ''}]`;
      opt.textContent = `${u.nombre} ${u.apellido} ${cursoStr}`.trim();
      // Guardar nombre, apellido y curso en data-* para búsqueda y selección
      opt.dataset.nombre = (u.nombre || '').toLowerCase();
      opt.dataset.apellido = (u.apellido || '').toLowerCase();
      opt.dataset.curso = (u.curso || '').toLowerCase();
      selEst.appendChild(opt);
    });
  } catch (e) {
    selEst.innerHTML += '<option disabled>Error al cargar estudiantes</option>';
  }
  // Asignaturas
  const selAsig = document.getElementById('sel-asignatura');
  selAsig.innerHTML = '<option value="">-- Seleccionar --</option>';
  try {
    const res = await fetch(`${API_BASE}/api/asignaturas`);
    const data = await res.json();
    data.forEach(nombre => {
      const opt = document.createElement('option');
      opt.value = nombre;
      opt.textContent = nombre;
      selAsig.appendChild(opt);
    });
  } catch (e) {
    selAsig.innerHTML += '<option disabled>Error al cargar asignaturas</option>';
  }
}

// Guardar referencia a la última nota editada (para modo edición)
let notaEditando = null;

// Guardar nota
async function guardarNota(e) {
  e.preventDefault();
  const estudiante = document.getElementById('sel-estudiante').value;
  const asignatura = document.getElementById('sel-asignatura').value;
  const cuatrimestre = document.getElementById('sel-cuatrimestre').value;
  const informe = document.getElementById('sel-tipo-informe').value;
  const nota = document.getElementById('inp-nota').value;
  const fecha = document.getElementById('inp-fecha').value;
  if (!estudiante || !asignatura || !cuatrimestre || !informe || !nota || !fecha) {
    alert('Complete todos los campos.');
    return;
  }
  const body = { estudiante, asignatura, cuatrimestre, informe, nota, fecha };
  const btn = e.submitter || e.target.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    // Si estamos editando, puedes implementar aquí la lógica de actualización si tu backend lo soporta.
    // Por ahora, solo guardamos como nueva.
    // Log para depuración
    console.log('Enviando nota:', body);
    const res = await fetch(`${API_BASE}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    // Log para depuración
    console.log('Respuesta backend:', data);
    if (!data.ok) throw new Error(data.error || 'Error');
    alert('Nota guardada');
    e.target.reset();
    notaEditando = null; // Salir de modo edición
    cargarUltimasNotas();
  } catch (err) {
    alert('Error al guardar nota: ' + (err.message || ''));
  }
  btn.disabled = false;
}

// Cargar últimas notas
async function cargarUltimasNotas() {
  const tbody = document.getElementById('tabla-ultimas-notas');
  tbody.innerHTML = '<tr><td colspan="7">Cargando...</td></tr>';
  try {
    const res = await fetch(`${API_BASE}/api/ultimas-notas`);
    const data = await res.json();
    tbody.innerHTML = '';
    data.forEach(n => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${n.estudiante}</td>
        <td>${n.asignatura}</td>
        <td>${n.cuatrimestre || ''}</td>
        <td>${n.informe || ''}</td>
        <td>${n.nota}</td>
        <td>${n.fecha_registro ? n.fecha_registro.substring(0, 10) : ''}</td>
        <td style="display:flex;gap:8px;">
          <button class="btn-editar"
            data-estudiante="${n.estudiante}"
            data-asignatura="${n.asignatura}"
            data-cuatrimestre="${n.cuatrimestre || ''}"
            data-informe="${n.informe || ''}"
            data-nota="${n.nota}"
            data-fecha="${n.fecha_registro ? n.fecha_registro.substring(0, 10) : ''}"
          >Editar</button>
          <button class="btn-eliminar"
            data-estudiante="${n.estudiante}"
            data-asignatura="${n.asignatura}"
            data-cuatrimestre="${n.cuatrimestre || ''}"
            data-informe="${n.informe || ''}"
            data-nota="${n.nota}"
            data-fecha="${n.fecha_registro ? n.fecha_registro.substring(0, 10) : ''}"
          >Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    // Botón eliminar
    tbody.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.onclick = async function() {
        if (!confirm('¿Eliminar esta nota?')) return;
        const payload = {
          estudiante: btn.dataset.estudiante,
          asignatura: btn.dataset.asignatura,
          cuatrimestre: btn.dataset.cuatrimestre,
          informe: btn.dataset.informe,
          nota: btn.dataset.nota,
          fecha: btn.dataset.fecha
        };
        try {
          const res = await fetch(`${API_BASE}/api/eliminar-nota`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!data.ok) throw new Error();
          cargarUltimasNotas();
        } catch {
          alert('No se pudo eliminar la nota');
        }
      };
    });
    // Botón editar
    tbody.querySelectorAll('.btn-editar').forEach(btn => {
      btn.onclick = function() {
        // Cambiar a la pestaña de carga de notas
        document.querySelectorAll('.tab-btn').forEach(b => {
          b.classList.toggle('is-active', b.getAttribute('data-target') === 'cargar-notas');
        });
        document.querySelectorAll('.tab-content').forEach(sec => {
          if (sec.id === 'cargar-notas') {
            sec.classList.add('is-visible');
            sec.style.display = '';
          } else {
            sec.classList.remove('is-visible');
            sec.style.display = 'none';
          }
        });
        // Seleccionar estudiante por nombre, apellido y curso
        document.getElementById('sel-estudiante').value = buscarOpcionPorNombreCurso(
          'sel-estudiante',
          btn.dataset.estudiante
        );
        document.getElementById('sel-asignatura').value = btn.dataset.asignatura;
        document.getElementById('sel-cuatrimestre').value = btn.dataset.cuatrimestre;
        document.getElementById('sel-tipo-informe').value = btn.dataset.informe;
        document.getElementById('inp-nota').value = btn.dataset.nota;
        document.getElementById('inp-fecha').value = btn.dataset.fecha;
        notaEditando = { ...btn.dataset };
      };
    });
  } catch {
    tbody.innerHTML = '<tr><td colspan="7">Error al cargar notas</td></tr>';
  }
}

// Utilidad para buscar opción por nombre, apellido y curso
function buscarOpcionPorNombreCurso(selectId, nombreEstudiante) {
  const sel = document.getElementById(selectId);
  if (!sel) return '';
  const texto = (nombreEstudiante || '').toLowerCase();
  for (let opt of sel.options) {
    // Buscar por nombre, apellido y curso juntos
    const nombreCompleto = `${opt.dataset.nombre} ${opt.dataset.apellido} ${opt.dataset.curso}`.trim();
    if (nombreCompleto && texto && nombreCompleto.includes(texto)) {
      return opt.value;
    }
    // También permitir búsqueda por texto visible
    if (opt.textContent.toLowerCase().includes(texto)) {
      return opt.value;
    }
  }
  return '';
}

// Filtrar tabla de notas por nombre y apellido del estudiante
function filtrarTablaNotas() {
  const filtro = (document.getElementById('search-alumno').value || '').toLowerCase();
  const tbody = document.getElementById('tabla-ultimas-notas');
  if (!tbody) return;
  Array.from(tbody.getElementsByTagName('tr')).forEach(tr => {
    const tdEstudiante = tr.querySelector('td');
    if (!tdEstudiante) return;
    const nombre = (tdEstudiante.textContent || '').toLowerCase();
    tr.style.display = nombre.includes(filtro) ? '' : 'none';
  });
}

// Barra de búsqueda para estudiantes en el formulario
function filtrarEstudiantesForm() {
  const filtro = (document.getElementById('search-estudiante-form').value || '').toLowerCase();
  const sel = document.getElementById('sel-estudiante');
  for (let opt of sel.options) {
    if (!opt.value) continue; // No ocultar la opción "-- Seleccionar --"
    // Buscar en nombre, apellido y curso
    const texto = `${opt.dataset.nombre} ${opt.dataset.apellido} ${opt.dataset.curso}`.toLowerCase();
    opt.style.display = texto.includes(filtro) ? '' : 'none';
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  cargarSelectsNotas();
  cargarUltimasNotas();
  // Formulario
  const form = document.getElementById('form-notas');
  if (form) form.addEventListener('submit', guardarNota);
  // Filtro tabla dashboard
  const search = document.getElementById('search-alumno');
  if (search) search.addEventListener('input', filtrarTablaNotas);
  // Filtro estudiantes en formulario
  const searchEstForm = document.getElementById('search-estudiante-form');
  if (searchEstForm) searchEstForm.addEventListener('input', filtrarEstudiantesForm);
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Quitar clase activa de todos
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('is-active'));
      this.classList.add('is-active');
      // Mostrar la sección correspondiente
      const target = this.getAttribute('data-target');
      document.querySelectorAll('.tab-content').forEach(sec => {
        if (sec.id === target) {
          sec.classList.add('is-visible');
          sec.style.display = '';
        } else {
          sec.classList.remove('is-visible');
          sec.style.display = 'none';
        }
      });
    });
  });
});
