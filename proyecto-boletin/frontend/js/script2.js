document.addEventListener('DOMContentLoaded', () => {
  const studentNameEl = document.getElementById('student-name');
  const gradesBody = document.getElementById('grades-body');
  const overallAverageEl = document.getElementById('overall-average');

  // Sin datos de ejemplo: el nombre y tabla se mantienen vacíos hasta obtener datos reales
  if (studentNameEl) studentNameEl.textContent = '';

  // Renderiza las notas del estudiante agrupadas por asignatura y muestra el boletín
  function renderNotasEstudiante(notas) {
    console.log('Renderizando notas en frontend:', notas); // Log para depuración
    gradesBody.innerHTML = '';
    if (!Array.isArray(notas) || notas.length === 0) {
      gradesBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No hay notas registradas.</td></tr>';
      if (overallAverageEl) overallAverageEl.textContent = '-';
      return;
    }
    // Agrupar por asignatura
    const asignaturas = {};
    notas.forEach(n => {
      if (!asignaturas[n.asignatura]) asignaturas[n.asignatura] = {};
      const key = `${n.cuatrimestre || ''}|${n.informe || ''}`;
      asignaturas[n.asignatura][key] = n.nota;
    });
    let sum = 0, count = 0;
    Object.keys(asignaturas).forEach(asig => {
      const n = asignaturas[asig];
      // Extraer cada campo, si no existe dejar vacío
      const n11 = n['1° Cuatrimestre|1° Informe'] || '';
      const n12 = n['1° Cuatrimestre|2° Informe'] || '';
      const n1f = n['1° Cuatrimestre|Final'] || '';
      const n21 = n['2° Cuatrimestre|1° Informe'] || '';
      const n22 = n['2° Cuatrimestre|2° Informe'] || '';
      const n2f = n['2° Cuatrimestre|Final'] || '';
      // Nota definitiva: promedio de los finales si existen, si no, vacío
      let def = '';
      const finals = [n1f, n2f].filter(x => x !== '');
      if (finals.length) {
        def = (finals.reduce((a, b) => Number(a) + Number(b), 0) / finals.length).toFixed(2);
        sum += Number(def);
        count++;
      }
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${asig}</td>
        <td>${n11}</td>
        <td>${n12}</td>
        <td>${n1f}</td>
        <td>${n21}</td>
        <td>${n22}</td>
        <td>${n2f}</td>
        <td>${def}</td>
      `;
      gradesBody.appendChild(tr);
    });
    if (overallAverageEl) overallAverageEl.textContent = count ? (sum / count).toFixed(2) : '-';
  }
  window.renderNotasEstudiante = renderNotasEstudiante;
});
