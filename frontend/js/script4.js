/*
  Nuevo script: obtiene datos reales del backend admin (http://localhost:3004)
  - GET /api/pendientes  -> lista de solicitudes { usuario, email, fecha }
  - GET /api/activos     -> lista de usuarios activos { usuario, rol, estado }
  - POST /api/pendientes/aceptar  { usuario }
  - POST /api/pendientes/rechazar { usuario }
*/
const API_BASE = 'http://localhost:3004';

async function fetchPendientes() {
  try {
    const res = await fetch(`${API_BASE}/api/pendientes`);
    if (!res.ok) throw new Error('Fetch pendientes falló');
    return await res.json();
  } catch (err) {
    console.error('Error obteniendo pendientes:', err);
    return [];
  }
}

async function fetchActivos() {
  try {
    const res = await fetch(`${API_BASE}/api/activos`);
    if (!res.ok) throw new Error('Fetch activos falló');
    return await res.json();
  } catch (err) {
    console.error('Error obteniendo activos:', err);
    return [];
  }
}

function clearElem(el) { if (el) el.innerHTML = ''; }

function renderPendientesTable(pendientes) {
  const tbody = document.getElementById('tabla-pendientes');
  if (!tbody) return;
  clearElem(tbody);
  pendientes.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.usuario}</td>
      <td>${u.email || ''}</td>
      <td>${u.fecha || ''}</td>
      <td>
        <button class="action-btn accept">A</button>
        <button class="action-btn reject">R</button>
      </td>
    `;
    tr.querySelector('.accept').addEventListener('click', () => aceptarPendiente(u.usuario));
    tr.querySelector('.reject').addEventListener('click', () => rechazarPendiente(u.usuario));
    tbody.appendChild(tr);
  });
}

function renderActivosTable(activos) {
  const tbody = document.getElementById('tabla-activos');
  if (!tbody) return;
  clearElem(tbody);
  activos.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.usuario}</td>
      <td>${u.rol || '—'}</td>
      <td>${u.estado || '—'}</td>
    `;
    tbody.appendChild(tr);
  });
}

async function aceptarPendiente(usuario) {
  try {
    const res = await fetch(`${API_BASE}/api/pendientes/aceptar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario })
    });
    if (!res.ok) throw new Error('Aceptar falló');
    await refreshAll();
  } catch (err) {
    console.error('Error aceptar:', err);
    alert('No se pudo aceptar el usuario. Revisa la consola.');
  }
}

async function rechazarPendiente(usuario) {
  try {
    const res = await fetch(`${API_BASE}/api/pendientes/rechazar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario })
    });
    if (!res.ok) throw new Error('Rechazar falló');
    await refreshAll();
  } catch (err) {
    console.error('Error rechazar:', err);
    alert('No se pudo rechazar el usuario. Revisa la consola.');
  }
}

async function refreshAll() {
  const [pendientes, activos] = await Promise.all([fetchPendientes(), fetchActivos()]);
  renderPendientesTable(pendientes);
  renderActivosTable(activos);
}

// Filtro en frontend (buscador) que usa la tabla ya rendereada
function filtrarUsuarios() {
  const filtro = document.getElementById('searchUser')?.value?.toLowerCase() || '';
  const tbody = document.getElementById('tabla-activos');
  if (!tbody) return;
  Array.from(tbody.children).forEach(tr => {
    const usuario = (tr.children[0]?.textContent || '').toLowerCase();
    tr.style.display = usuario.includes(filtro) ? '' : 'none';
  });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // conectar buscador
  const search = document.getElementById('searchUser');
  if (search) search.addEventListener('input', filtrarUsuarios);

  // cargar datos desde backend
  refreshAll();
});

