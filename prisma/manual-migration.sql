-- Migración inicial - 13 tablas del sistema

-- TABLA 1: ROLES
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 2: USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(200) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    id_rol INTEGER REFERENCES roles(id_rol) ON DELETE SET NULL,
    ultima_conexion TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_usuarios_usuario ON usuarios(usuario);
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);

-- TABLA 3: ETIQUETAS (Tags)
CREATE TABLE IF NOT EXISTS etiquetas (
    id_etiqueta SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    descripcion TEXT
);

-- TABLA 4: PUBLICACIONES
CREATE TABLE IF NOT EXISTS publicaciones (
    id_publicacion SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    contenido TEXT NOT NULL,
    imagen_principal VARCHAR(500),
    estado VARCHAR(50) DEFAULT 'borrador',
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_publicaciones_slug ON publicaciones(slug);
CREATE INDEX idx_publicaciones_estado ON publicaciones(estado);
CREATE INDEX idx_publicaciones_usuario ON publicaciones(id_usuario);

-- TABLA 5: PUBLICACION_ETIQUETA (Junction N:N)
CREATE TABLE IF NOT EXISTS publicacion_etiqueta (
    id_publicacion_etiqueta SERIAL PRIMARY KEY,
    id_publicacion INTEGER NOT NULL REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    id_etiqueta INTEGER NOT NULL REFERENCES etiquetas(id_etiqueta) ON DELETE CASCADE,
    UNIQUE(id_publicacion, id_etiqueta)
);

CREATE INDEX idx_pub_etiq_publicacion ON publicacion_etiqueta(id_publicacion);
CREATE INDEX idx_pub_etiq_etiqueta ON publicacion_etiqueta(id_etiqueta);

-- TABLA 6: COMENTARIOS
CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario SERIAL PRIMARY KEY,
    id_publicacion INTEGER NOT NULL REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    nombre VARCHAR(150),
    mensaje TEXT NOT NULL,
    aprobado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comentarios_publicacion ON comentarios(id_publicacion);
CREATE INDEX idx_comentarios_aprobado ON comentarios(aprobado);

-- TABLA 7: REACCIONES
CREATE TABLE IF NOT EXISTS reacciones (
    id_reaccion SERIAL PRIMARY KEY,
    id_comentario INTEGER REFERENCES comentarios(id_comentario) ON DELETE CASCADE,
    nombre VARCHAR(150),
    tipo_reaccion VARCHAR(50) DEFAULT 'like',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reacciones_comentario ON reacciones(id_comentario);

-- TABLA 8: ASUNTOS DE CONTACTO
CREATE TABLE IF NOT EXISTS asuntos_contacto (
    id_asunto SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL UNIQUE,
    descripcion TEXT
);

-- TABLA 9: MENSAJES DE CONTACTO
CREATE TABLE IF NOT EXISTS mensajes_contacto (
    id_mensaje SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    correo VARCHAR(200) NOT NULL,
    id_asunto INTEGER REFERENCES asuntos_contacto(id_asunto) ON DELETE SET NULL,
    mensaje TEXT NOT NULL,
    respondido BOOLEAN DEFAULT false,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP
);

CREATE INDEX idx_mensajes_respondido ON mensajes_contacto(respondido);

-- TABLA 10: CORREOS DESTINO
CREATE TABLE IF NOT EXISTS correos_destino (
    id_correo_destino SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    correo VARCHAR(200) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT true
);

-- TABLA 11: DIRECTIVOS
CREATE TABLE IF NOT EXISTS directivos (
    id_directivo SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(200) NOT NULL,
    cargo VARCHAR(200),
    foto VARCHAR(500),
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA 12: HISTORIAL DE ACCIONES (Audit Log)
CREATE TABLE IF NOT EXISTS historial_acciones (
    id_accion SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    accion VARCHAR(255) NOT NULL,
    tabla_afectada VARCHAR(100),
    id_registro INTEGER,
    detalles TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_historial_usuario ON historial_acciones(id_usuario);
CREATE INDEX idx_historial_fecha ON historial_acciones(fecha_accion);

-- TABLA 13: VISITAS
CREATE TABLE IF NOT EXISTS visitas (
    id_visita SERIAL PRIMARY KEY,
    id_publicacion INTEGER NOT NULL REFERENCES publicaciones(id_publicacion) ON DELETE CASCADE,
    ip VARCHAR(100),
    user_agent TEXT,
    fecha_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitas_publicacion ON visitas(id_publicacion);
CREATE INDEX idx_visitas_fecha ON visitas(fecha_visita);

-- Datos iniciales

-- Insertar roles
INSERT INTO roles (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Editor', 'Puede crear y editar contenido'),
('Usuario', 'Usuario básico del sistema')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar asuntos de contacto
INSERT INTO asuntos_contacto (nombre, descripcion) VALUES
('Información General', 'Consultas generales sobre el colegio'),
('Admisiones', 'Consultas sobre proceso de admisión'),
('Soporte Técnico', 'Problemas técnicos con el sitio web')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar etiquetas
INSERT INTO etiquetas (nombre, slug, descripcion) VALUES
('Noticias', 'noticias', 'Noticias del colegio'),
('Eventos', 'eventos', 'Eventos y actividades'),
('Académico', 'academico', 'Contenido académico'),
('Deportes', 'deportes', 'Actividades deportivas'),
('Cultura', 'cultura', 'Actividades culturales')
ON CONFLICT (nombre) DO NOTHING;

-- Mensaje de confirmación
SELECT 'Migración completada exitosamente. 13 tablas creadas.' AS resultado;
