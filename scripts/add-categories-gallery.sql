-- ==========================================
-- Script: Agregar Categorías y Galería
-- ==========================================

-- TABLA: categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100), -- Ej: 📰, 📅, ⚽, 🎓
    color VARCHAR(50), -- Ej: blue, red, green
    orden INTEGER DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: galeria (independiente de publicaciones)
CREATE TABLE IF NOT EXISTS galeria (
    id_imagen SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    url_imagen VARCHAR(500) NOT NULL,
    tipo VARCHAR(50) DEFAULT 'imagen', -- imagen, video
    id_usuario INTEGER REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar campo id_categoria a publicaciones
ALTER TABLE publicaciones 
ADD COLUMN IF NOT EXISTS id_categoria INTEGER REFERENCES categorias(id_categoria) ON DELETE SET NULL;

-- Índices
CREATE INDEX IF NOT EXISTS idx_publicaciones_categoria ON publicaciones(id_categoria);
CREATE INDEX IF NOT EXISTS idx_categorias_slug ON categorias(slug);
CREATE INDEX IF NOT EXISTS idx_galeria_tipo ON galeria(tipo);

-- ==========================================
-- Datos de ejemplo para categorías
-- ==========================================

INSERT INTO categorias (nombre, slug, descripcion, icono, color, orden) VALUES
('Noticias', 'noticias', 'Noticias y novedades del colegio', '📰', 'blue', 1),
('Eventos', 'eventos', 'Eventos y actividades escolares', '📅', 'green', 2),
('Deportes', 'deportes', 'Actividades deportivas y competencias', '⚽', 'red', 3),
('Académico', 'academico', 'Información académica y educativa', '🎓', 'purple', 4),
('Cultura', 'cultura', 'Actividades culturales y artísticas', '🎭', 'pink', 5),
('Anuncios', 'anuncios', 'Comunicados y anuncios importantes', '📢', 'yellow', 6)
ON CONFLICT (nombre) DO NOTHING;

-- ==========================================
-- Verificación
-- ==========================================

SELECT 'Categorías creadas:' as mensaje;
SELECT id_categoria, nombre, slug, icono, color FROM categorias ORDER BY orden;

SELECT 'Tabla galeria creada:' as mensaje;
SELECT COUNT(*) as total_imagenes FROM galeria;
