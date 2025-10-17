-- Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS boletin
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;
USE boletin;

SET NAMES utf8mb4;

-- Eliminar tablas si existen (en orden inverso de dependencias)
DROP TABLE IF EXISTS notas;
DROP TABLE IF EXISTS asignaturas;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

-- Tabla roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  INDEX idx_estudiantes_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla asignaturas
CREATE TABLE IF NOT EXISTS asignaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_asignaturas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla notas
CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  asignatura_id INT NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
USE boletin;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Departamento'),(3, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado)
VALUES
  (1, 'Ana', 'Pérez','ana@ejemplo.com','$2y$12$examplehash1','12345678',1,'Activo'),
  (2, 'Juan', 'L.','juan@ejemplo.com','$2y$12$examplehash2','87654321',2,'Pendiente'),
  (3, 'María', 'S.','maria@ejemplo.com','$2y$12$examplehash3','11223344',2,'Activo');

INSERT IGNORE INTO estudiantes (id, usuario_id) VALUES (1, 1);

INSERT IGNORE INTO asignaturas (id, nombre) VALUES
  (1, 'Matemática'),
  (2, 'Inglés Técnico'),
  (3, 'Marco jurídico y derechos del trabajo'),
  (4, 'Asistencia 2'),
  (5, 'Autogestión'),
  (6, 'Hardware 4'),
  (7, 'Prácticas Profesionalizantes 2'),
  (8, 'Programación'),
  (9, 'Redes 3');

INSERT IGNORE INTO notas (id, estudiante_id, asignatura_id, nota, fecha_registro)
VALUES (1, 1, 1, 8.50, '2023-05-01');

-- Crear base de datos para Estudiante
CREATE DATABASE IF NOT EXISTS boletin_estudiante
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;
USE boletin_estudiante;

DROP TABLE IF EXISTS notas;
DROP TABLE IF EXISTS asignaturas;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  INDEX idx_estudiantes_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS asignaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_asignaturas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  asignatura_id INT NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE boletin_estudiante;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Departamento'),(3, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado)
VALUES
  (1, 'Ana', 'Pérez','ana@ejemplo.com','$2y$12$examplehash1','12345678',1,'Activo'),
  (2, 'Juan', 'L.','juan@ejemplo.com','$2y$12$examplehash2','87654321',2,'Pendiente'),
  (3, 'María', 'S.','maria@ejemplo.com','$2y$12$examplehash3','11223344',2,'Activo');

INSERT IGNORE INTO estudiantes (id, usuario_id) VALUES (1, 1);

INSERT IGNORE INTO asignaturas (id, nombre) VALUES
  (1, 'Matemática'),
  (2, 'Inglés Técnico'),
  (3, 'Marco jurídico y derechos del trabajo'),
  (4, 'Asistencia 2'),
  (5, 'Autogestión'),
  (6, 'Hardware 4'),
  (7, 'Prácticas Profesionalizantes 2'),
  (8, 'Programación'),
  (9, 'Redes 3');

INSERT IGNORE INTO notas (id, estudiante_id, asignatura_id, nota, fecha_registro)
VALUES (1, 1, 1, 8.50, '2023-05-01');

-- Crear base de datos para Departamento
CREATE DATABASE IF NOT EXISTS boletin_departamento
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;
USE boletin_departamento;

DROP TABLE IF EXISTS notas;
DROP TABLE IF EXISTS asignaturas;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  INDEX idx_estudiantes_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS asignaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_asignaturas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  asignatura_id INT NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE boletin_departamento;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Departamento'),(3, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado)
VALUES
  (1, 'Ana', 'Pérez','ana@ejemplo.com','$2y$12$examplehash1','12345678',1,'Activo'),
  (2, 'Juan', 'L.','juan@ejemplo.com','$2y$12$examplehash2','87654321',2,'Pendiente'),
  (3, 'María', 'S.','maria@ejemplo.com','$2y$12$examplehash3','11223344',2,'Activo');

INSERT IGNORE INTO estudiantes (id, usuario_id) VALUES (1, 1);

INSERT IGNORE INTO asignaturas (id, nombre) VALUES
  (1, 'Matemática'),
  (2, 'Inglés Técnico'),
  (3, 'Marco jurídico y derechos del trabajo'),
  (4, 'Asistencia 2'),
  (5, 'Autogestión'),
  (6, 'Hardware 4'),
  (7, 'Prácticas Profesionalizantes 2'),
  (8, 'Programación'),
  (9, 'Redes 3');

INSERT IGNORE INTO notas (id, estudiante_id, asignatura_id, nota, fecha_registro)
VALUES (1, 1, 1, 8.50, '2023-05-01');

-- Crear base de datos para Admin
CREATE DATABASE IF NOT EXISTS boletin_admin
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;
USE boletin_admin;

DROP TABLE IF EXISTS notas;
DROP TABLE IF EXISTS asignaturas;
DROP TABLE IF EXISTS estudiantes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  INDEX idx_estudiantes_usuario (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS asignaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_asignaturas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  asignatura_id INT NOT NULL,
  nota DECIMAL(4,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE boletin_admin;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Departamento'),(3, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado)
VALUES
  (1, 'Ana', 'Pérez','ana@ejemplo.com','$2y$12$examplehash1','12345678',1,'Activo'),
  (2, 'Juan', 'L.','juan@ejemplo.com','$2y$12$examplehash2','87654321',2,'Pendiente'),
  (3, 'María', 'S.','maria@ejemplo.com','$2y$12$examplehash3','11223344',2,'Activo');

INSERT IGNORE INTO estudiantes (id, usuario_id) VALUES (1, 1);

INSERT IGNORE INTO asignaturas (id, nombre) VALUES
  (1, 'Matemática'),
  (2, 'Inglés Técnico'),
  (3, 'Marco jurídico y derechos del trabajo'),
  (4, 'Asistencia 2'),
  (5, 'Autogestión'),
  (6, 'Hardware 4'),
  (7, 'Prácticas Profesionalizantes 2'),
  (8, 'Programación'),
  (9, 'Redes 3');

INSERT IGNORE INTO notas (id, estudiante_id, asignatura_id, nota, fecha_registro)
VALUES (1, 1, 1, 8.50, '2023-05-01');

-- Crear base de datos para Registro
CREATE DATABASE IF NOT EXISTS boletin_registro
  DEFAULT CHARACTER SET = utf8mb4
  DEFAULT COLLATE = utf8mb4_unicode_ci;

USE boletin_registro;

DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  dni VARCHAR(20) NOT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
