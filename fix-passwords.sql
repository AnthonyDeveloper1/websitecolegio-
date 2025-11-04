-- Actualizar contraseñas de usuarios
UPDATE usuarios SET clave = '$2a$10$VV5CYxe6.QPuuWjzcJ1.p.oONq1jXmTBMlBu6Z6oCZZWGogfU9eZe' WHERE correo = 'admin@colegio.edu';
UPDATE usuarios SET clave = '$2a$10$H160LsF2.4xvJxyuaDQ7Qer1ETYP/nEe7L7Hp5GDeumxbKVoW8c2W' WHERE correo = 'admin.sa@colegio.edu';

SELECT correo, LEFT(clave, 30) as hash_preview FROM usuarios ORDER BY id_usuario;
