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
  apellido VARCHAR(100) DEFAULT '',
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,
  dni VARCHAR(20) DEFAULT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  curso VARCHAR(32) DEFAULT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla estudiantes
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  codigo_interno VARCHAR(60) DEFAULT NULL,
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
  nota DECIMAL(5,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  cuatrimestre VARCHAR(32) DEFAULT NULL,
  informe VARCHAR(32) DEFAULT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos de ejemplo
INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Profesor'),(3, 'Departamento'),(4, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado, curso)
VALUES
  (3, 'Profesor', 'Demo','prof@ejemplo.com','prof123',NULL,2,'Activo',NULL);

INSERT IGNORE INTO asignaturas (nombre) VALUES
  ('Matemática'),
  ('Inglés Técnico'),
  ('Marco jurídico y derechos del trabajo'),
  ('Asistencia 2'),
  ('Autogestión'),
  ('Hardware 4'),
  ('Prácticas Profesionalizantes 2'),
  ('Programación'),
  ('Redes 3');

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
  apellido VARCHAR(100) DEFAULT '',
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,
  dni VARCHAR(20) DEFAULT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  curso VARCHAR(32) DEFAULT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  codigo_interno VARCHAR(60) DEFAULT NULL,
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
  nota DECIMAL(5,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  cuatrimestre VARCHAR(32) DEFAULT NULL,
  informe VARCHAR(32) DEFAULT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE boletin_estudiante;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Departamento'),(3, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado, curso)
VALUES
  (3, 'Profesor', 'Demo','prof@ejemplo.com','prof123',NULL,2,'Activo',NULL);

INSERT IGNORE INTO asignaturas (nombre) VALUES
  ('Matemática'),
  ('Inglés Técnico'),
  ('Marco jurídico y derechos del trabajo'),
  ('Asistencia 2'),
  ('Autogestión'),
  ('Hardware 4'),
  ('Prácticas Profesionalizantes 2'),
  ('Programación'),
  ('Redes 3');

INSERT IGNORE INTO estudiantes (usuario_id) VALUES (4);

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
  apellido VARCHAR(100) DEFAULT '',
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) DEFAULT NULL,
  dni VARCHAR(20) DEFAULT NULL,
  rol_id INT NOT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') NOT NULL DEFAULT 'Pendiente',
  curso VARCHAR(32) DEFAULT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_rol (rol_id),
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  codigo_interno VARCHAR(60) DEFAULT NULL,
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
  nota DECIMAL(5,2) NOT NULL,
  fecha_registro DATE NOT NULL,
  cuatrimestre VARCHAR(32) DEFAULT NULL,
  informe VARCHAR(32) DEFAULT NULL,
  INDEX idx_notas_estudiante (estudiante_id),
  INDEX idx_notas_asignatura (asignatura_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (asignatura_id) REFERENCES asignaturas(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

USE boletin_departamento;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Departamento'),(3, 'Admin');

INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, dni, rol_id, estado, curso)
VALUES
  (3, 'Profesor', 'Demo','prof@ejemplo.com','prof123',NULL,2,'Activo',NULL);

INSERT IGNORE INTO asignaturas (nombre) VALUES
  ('Matemática'),
  ('Inglés Técnico'),
  ('Marco jurídico y derechos del trabajo'),
  ('Asistencia 2'),
  ('Autogestión'),
  ('Hardware 4'),
  ('Prácticas Profesionalizantes 2'),
  ('Programación'),
  ('Redes 3');

INSERT IGNORE INTO notas (estudiante_id, asignatura_id, nota, fecha_registro, cuatrimestre, informe)
VALUES
  (1, 1, 8.50, '2023-05-01', '1° Cuatrimestre', '1° Informe'),
  (1, 8, 9.00, '2023-05-02', '1° Cuatrimestre', 'Final'),
  (2, 1, 7.25, '2023-05-03', '2° Cuatrimestre', '2° Informe');

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
  apellido VARCHAR(100) DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  dni VARCHAR(20) DEFAULT NULL,
  rol_id INT DEFAULT NULL,
  estado ENUM('Pendiente','Activo','Rechazado') DEFAULT 'Pendiente',
  curso VARCHAR(32) DEFAULT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (id, nombre) VALUES (1, 'Estudiante'),(2, 'Profesor'),(3, 'Departamento'),(4, 'Admin');

-- Usuario admin exclusivo para admin.html
INSERT IGNORE INTO usuarios (id, nombre, apellido, email, password_hash, rol_id, estado)
VALUES
  (1, 'Administrador', 'General', 'admin@colegio.com', 'admin123', 4, 'Activo');

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
  nombre VARCHAR(120) NOT NULL,
  apellido VARCHAR(120) DEFAULT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol_id INT DEFAULT 1,
  estado ENUM('Pendiente','Activo','Rechazado') DEFAULT 'Pendiente',
  dni VARCHAR(32) DEFAULT NULL,
  curso VARCHAR(32) DEFAULT NULL,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (id, nombre) VALUES
  (1, 'Estudiante'), (2, 'Profesor'), (3, 'Departamento'), (4, 'Admin');

INSERT IGNORE INTO usuarios (nombre, apellido, email, password_hash, rol_id, estado, dni, curso)
VALUES
  ('Ana', 'Pérez', 'ana.perez@ejemplo.com', 'ana123', 1, 'Activo', '12345678', '1°1'),
  ('Carlos', 'López', 'carlos.lopez@ejemplo.com', 'carlos123', 1, 'Activo', '23456789', '2°1'),
  ('Ivo', 'Portioli', 'impiniivo@gmail.com', '12345678a', 1, 'Activo', NULL, NULL),
  ('Juan', 'Gomez', 'portioli.sm.sp@gmail.com', 'hola1234', 2, 'Activo', NULL, NULL);

