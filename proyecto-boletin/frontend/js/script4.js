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

function rolNombre(rol_id) {
  const roles = { 1: 'Usuario', 2: 'Editor', 3: 'Admin' };
  return roles[rol_id] || 'Desconocido';
}

function renderPendientesTable(pendientes) {
  const tbody = document.getElementById('tabla-pendientes');
  if (!tbody) return;
  clearElem(tbody);
  pendientes.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nombre}</td>
      <td>${u.email || ''}</td>
      <td>${rolNombre(u.rol_id)}</td>
      <td>${u.estado || ''}</td>
      <td>
        <button class="action-btn accept">Aprobar</button>
        <button class="action-btn reject" style="margin-left:8px;">Rechazar</button>
      </td>
    `;
    tr.querySelector('.accept').addEventListener('click', () => aprobarUsuario(u.id));
    tr.querySelector('.reject').addEventListener('click', () => rechazarUsuario(u.id));
    tbody.appendChild(tr);
  });
  if (!pendientes.length) {
    tbody.innerHTML = '<tr><td colspan="6">No hay solicitudes pendientes</td></tr>';
  }
}

function renderActivosTable(activos) {
  const tbody = document.getElementById('tabla-activos');
  if (!tbody) return;
  clearElem(tbody);
  activos.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.nombre}</td>
      <td>${u.email}</td>
      <td>${rolNombre(u.rol_id)}</td>
      <td>${u.estado}</td>
      <td>
        <button class="action-btn edit" title="Editar usuario">&#9998;</button>
      </td>
    `;
    tr.querySelector('.edit').addEventListener('click', () => openEditModal(u.id, encodeURIComponent(u.email)));
    tbody.appendChild(tr);
  });
  if (!activos.length) {
    tbody.innerHTML = '<tr><td colspan="6">No hay usuarios activos</td></tr>';
  }
}

async function aprobarUsuario(id) {
  try {
    const res = await fetch(`${API_BASE}/api/pendientes/aceptar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Aceptar falló');
    await refreshAll();
  } catch (err) {
    console.error('Error aceptar:', err);
    alert('No se pudo aceptar el usuario. Revisa la consola.');
  }
}

async function rechazarUsuario(id) {
  try {
    const res = await fetch(`${API_BASE}/api/pendientes/rechazar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
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

// --- Modal edición usuario (importa backend perfil.js) ---
window.openEditModal = async function(id, encodedEmail) {
  try {
    const email = decodeURIComponent(encodedEmail || '');
    const res = await fetch('http://localhost:3005/api/perfil?email=' + encodeURIComponent(email));
    if (!res.ok) throw new Error('No se pudo obtener perfil');
    const data = await res.json();
    document.getElementById('edit-id').value = data.id || id || '';
    document.getElementById('edit-nombre').value = data.nombre || '';
    document.getElementById('edit-apellido').value = data.apellido || '';
    document.getElementById('edit-email').value = data.email || email || '';
    document.getElementById('edit-dni').value = data.dni || '';
    document.getElementById('edit-rol').value = data.rol_id || '1';
    document.getElementById('editModal').style.display = 'flex';
  } catch (err) {
    alert('No se pudo cargar los datos del usuario.');
  }
};

document.getElementById('editCancel')?.addEventListener('click', () => {
  document.getElementById('editModal').style.display = 'none';
});

document.getElementById('editForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('edit-id').value;
  const nombre = document.getElementById('edit-nombre').value.trim();
  const apellido = document.getElementById('edit-apellido').value.trim();
  const email = document.getElementById('edit-email').value.trim();
  const dni = document.getElementById('edit-dni').value.trim();
  const rol_id = parseInt(document.getElementById('edit-rol').value, 10) || 1;
  if (!nombre || !email) {
    alert('Nombre y email son obligatorios.');
    return;
  }
  try {
    const res = await fetch('http://localhost:3003/api/usuarios/actualizar', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nombre, apellido, email, dni, rol_id })
    });
    if (!res.ok) {
      const errBody = await res.json().catch(()=>null);
      throw new Error(errBody && errBody.error ? errBody.error : 'Error al actualizar');
    }
    alert('Usuario actualizado correctamente.');
    document.getElementById('editModal').style.display = 'none';
    await refreshAll();
  } catch (err) {
    alert('No se pudo actualizar el usuario. Revisa la consola.');
  }
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  // conectar buscador
  const search = document.getElementById('searchUser');
  if (search) search.addEventListener('input', filtrarUsuarios);

  // cargar datos desde backend
  refreshAll();
});

