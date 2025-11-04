-- Insertar una publicación de prueba
INSERT INTO publicaciones (titulo, slug, descripcion, contenido, imagen_principal, estado, id_usuario)
VALUES (
  'Primera Noticia de Prueba',
  'primera-noticia-prueba',
  'Esta es una noticia de prueba para verificar el sistema',
  'Contenido completo de la primera noticia de prueba. Aquí va el texto extenso.',
  NULL,
  'publicado',
  1
);

-- Verificar la inserción
SELECT id_publicacion, titulo, slug, estado FROM publicaciones;
