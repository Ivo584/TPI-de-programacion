// Mínima UI: simula inicio de sesión de profesor y muestra cursos + alumnos
const API_BASE = 'http://localhost:3006';

async function fetchCursos() {
  try {
    const res = await fetch(`${API_BASE}/api/cursos`);
    if (!res.ok) throw new Error('Error cargando cursos');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchAlumnos(curso) {
  try {
    const res = await fetch(`${API_BASE}/api/alumnos?curso=${encodeURIComponent(curso)}`);
    if (!res.ok) throw new Error('Error cargando alumnos');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function renderCursos(cursos) {
  const container = document.getElementById('courses-container');
  container.innerHTML = '';
  cursos.forEach(c => {
    const btn = document.createElement('button');
    btn.textContent = c;
    btn.className = 'curso-btn';
    btn.addEventListener('click', async () => {
      await onCursoClick(c);
    });
    container.appendChild(btn);
  });
}

async function onCursoClick(curso) {
  const alumnosSection = document.getElementById('alumnos-section');
  const alumnosList = document.getElementById('alumnos-list');
  const titulo = document.getElementById('alumnos-titulo');
  titulo.textContent = `Alumnos registrados en ${curso}`;
  alumnosList.innerHTML = '<p>Cargando...</p>';
  alumnosSection.style.display = '';
  const alumnos = await fetchAlumnos(curso);
  if (!alumnos || alumnos.length === 0) {
    alumnosList.innerHTML = '<p>No se encontraron alumnos para este curso.</p>';
    return;
  }
  // Render simple lista
  alumnosList.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'styled-table';
  table.innerHTML = `<thead><tr><th>Nombre</th><th>Email</th><th>DNI</th><th>Estado</th></tr></thead>`;
  const tbody = document.createElement('tbody');
  alumnos.forEach(a => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${a.nombre} ${a.apellido}</td><td>${a.email}</td><td>${a.dni || ''}</td><td>${a.estado || ''}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  alumnosList.appendChild(table);
}

// Simular "login" de profesor
function setRole(isProfesor) {
  const roleEl = document.getElementById('current-role');
  const btnLogin = document.getElementById('btn-profesor');
  const btnLogout = document.getElementById('btn-logout');
  const cursosSection = document.getElementById('cursos-section');

  if (isProfesor) {
    roleEl.textContent = 'Profesor';
    btnLogin.style.display = 'none';
    btnLogout.style.display = '';
    cursosSection.style.display = '';
    loadAndRenderCursos();
  } else {
    roleEl.textContent = 'Invitado';
    btnLogin.style.display = '';
    btnLogout.style.display = 'none';
    cursosSection.style.display = 'none';
    document.getElementById('alumnos-section').style.display = 'none';
  }
}

async function loadAndRenderCursos() {
  const cursos = await fetchCursos();
  renderCursos(cursos);
}

document.addEventListener('DOMContentLoaded', () => {
  // detectar role por query string ?role=Profesor
  const params = new URLSearchParams(location.search);
  const roleParam = params.get('role');
  const isProfesor = roleParam === 'Profesor';
  setRole(isProfesor);

  document.getElementById('btn-profesor').addEventListener('click', () => setRole(true));
  document.getElementById('btn-logout').addEventListener('click', () => setRole(false));
});
