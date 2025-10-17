document.addEventListener('DOMContentLoaded', () => {
  const studentNameEl = document.getElementById('student-name');
  const gradesBody = document.getElementById('grades-body');
  const overallAverageEl = document.getElementById('overall-average');

  // Reemplaza este nombre con la fuente de datos real
  studentNameEl.textContent = 'María Pérez';

  const subjects = [
    { name: 'Matemática',  c1i1: 8.5, c1i2: 7.0, c1f: 7.8, c2i1: 9.0, c2i2: 8.2, c2f: 8.6 },
    { name: 'Inglés Técnico', c1i1: 7.5, c1i2: 8.0, c1f: 7.8, c2i1: 8.4, c2i2: 8.9, c2f: 8.7 },
    { name: 'Marco jurídico y derechos del trabajo', c1i1: 9.0, c1i2: 9.2, c1f: 9.1, c2i1: 8.8, c2i2: 9.0, c2f: 8.9 },
    { name: 'Asistencia 2', c1i1: 10.0, c1i2: 10.0, c1f: 10.0, c2i1: 10.0, c2i2: 10.0, c2f: 10.0 },
    { name: 'Autogestión', c1i1: 8.0, c1i2: 7.5, c1f: 7.8, c2i1: 8.2, c2i2: 8.0, c2f: 8.1 },
    { name: 'Hardware 4', c1i1: 7.0, c1i2: 7.3, c1f: 7.2, c2i1: 7.8, c2i2: 8.1, c2f: 7.9 },
    { name: 'Prácticas Profesionalizantes 2', c1i1: 9.5, c1i2: 9.0, c1f: 9.2, c2i1: 9.3, c2i2: 9.4, c2f: 9.35 },
    { name: 'Programación', c1i1: 8.8, c1i2: 8.5, c1f: 8.65, c2i1: 8.9, c2i2: 9.1, c2f: 9.0 },
    { name: 'Redes 3', c1i1: 8.2, c1i2: 9.5, c1f: 8.55, c2i1: 6.9, c2i2: 7.1, c2f: 8.0 }
  ];

  let totalFinales = 0;

  subjects.forEach((s, index) => {
    const definitiva = ((s.c1f + s.c2f) / 2).toFixed(2);
    totalFinales += parseFloat(definitiva);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.name}</td>
      <td>${s.c1i1}</td>
      <td>${s.c1i2}</td>
      <td>${s.c1f.toFixed(2)}</td>
      <td>${s.c2i1}</td>
      <td>${s.c2i2}</td>
      <td>${s.c2f.toFixed(2)}</td>
      <td>${definitiva}</td>
    `;
    tr.style.animation = `fadeIn 0.5s ${(index + 1) * 0.1}s both`;
    gradesBody.appendChild(tr);
  });

  const average = (totalFinales / subjects.length).toFixed(2);
  overallAverageEl.textContent = average;
});
