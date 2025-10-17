// Datos simulados para demo
let usuariosPendientes = [
  { usuario: "juanperez", email: "juan@mail.com", fecha: "2024-06-01" },
  { usuario: "mariag", email: "maria@mail.com", fecha: "2024-06-02" }
];

let usuariosActivos = [
  { usuario: "admin", rol: "Administrador", estado: "Activo" },
  { usuario: "profesor1", rol: "Profesor", estado: "Activo" },
  { usuario: "alumno1", rol: "Alumno", estado: "Activo" }
];

function mostrarTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active-tab'));
  document.getElementById(tabId).classList.add('active-tab');
}

function renderPendientes() {
  const tbody = document.getElementById('tabla-pendientes');
  tbody.innerHTML = '';
  usuariosPendientes.forEach((u, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.usuario}</td>
      <td>${u.email}</td>
      <td>${u.fecha}</td>
      <td>
        <button class="action-btn accept" title="Aceptar" onclick="aceptarPendiente(${idx})">A</button>
        <button class="action-btn reject" title="Rechazar" onclick="rechazarPendiente(${idx})">R</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderActivos(filtro = "") {
  const tbody = document.getElementById('tabla-activos');
  tbody.innerHTML = '';
  usuariosActivos
    .filter(u => u.usuario.toLowerCase().includes(filtro.toLowerCase()))
    .forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${u.usuario}</td>
        <td>${u.rol}</td>
        <td>${u.estado}</td>
      `;
      tbody.appendChild(tr);
    });
}

function aceptarPendiente(idx) {
  const user = usuariosPendientes[idx];
  usuariosActivos.push({ usuario: user.usuario, rol: "Alumno", estado: "Activo" });
  usuariosPendientes.splice(idx, 1);
  renderPendientes();
  renderActivos(document.getElementById('searchUser')?.value || "");
}

function rechazarPendiente(idx) {
  usuariosPendientes.splice(idx, 1);
  renderPendientes();
}

function filtrarUsuarios() {
  const filtro = document.getElementById('searchUser').value;
  renderActivos(filtro);
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderPendientes();
  renderActivos();
});

