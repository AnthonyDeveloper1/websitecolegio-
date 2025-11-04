-- Initialization script for PostgreSQL
-- Este archivo se ejecuta automáticamente cuando se crea el contenedor

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda full-text

-- El resto de las tablas se crearán con Prisma Migrate
