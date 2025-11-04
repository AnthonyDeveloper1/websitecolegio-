# API Endpoints - Resumen

## Autenticación
- `POST /api/auth/login` - Login (email, password)
- `POST /api/auth/register` - Registro (email, username, fullName, password)

## Publicaciones
- `GET /api/publications` - Listar (filtro: tagId, status, search)
- `POST /api/publications` - Crear (requiere auth)
- `GET /api/publications/[id]` - Ver publicación + registra visita
- `PUT /api/publications/[id]` - Editar (requiere auth)
- `DELETE /api/publications/[id]` - Eliminar (solo admin)

## Tags/Etiquetas
- `GET /api/tags` - Listar tags
- `POST /api/tags` - Crear tag (requiere auth)
- `GET /api/tags/[id]` - Ver tag
- `PUT /api/tags/[id]` - Editar tag (requiere auth)
- `DELETE /api/tags/[id]` - Eliminar tag (solo admin)

## Comentarios
- `GET /api/comments` - Listar (filtros: publicationId, isApproved)
- `POST /api/comments` - Crear (público, requiere aprobación)
- `PUT /api/comments/[id]` - Aprobar/Editar (admin/editor)
- `DELETE /api/comments/[id]` - Eliminar (solo admin)

## Reacciones
- `POST /api/reactions` - Crear reacción (me_gusta, no_me_gusta)

## Directivos
- `GET /api/directors` - Listar (filtro: status)
- `POST /api/directors` - Crear (solo admin)
- `GET /api/directors/[id]` - Ver directivo
- `PUT /api/directors/[id]` - Editar (solo admin)
- `DELETE /api/directors/[id]` - Eliminar (solo admin)

## Contacto
- `GET /api/contact` - Listar mensajes (admin/editor)
- `POST /api/contact` - Enviar mensaje (público)
- `PUT /api/contact/[id]` - Marcar respondido (admin/editor)
- `DELETE /api/contact/[id]` - Eliminar mensaje (solo admin)
- `GET /api/contact-subjects` - Listar asuntos
- `POST /api/contact-subjects` - Crear asunto (solo admin)

## Sistema
- `GET /api/roles` - Listar roles
- `GET /api/users` - Listar usuarios (solo admin)
- `GET /api/test` - Test conexión + estadísticas de 13 tablas

## Headers de autenticación
Middleware añade automáticamente:
- `x-user-id` - ID del usuario
- `x-user-email` - Email del usuario
- `x-user-username` - Username del usuario
- `x-user-role` - Rol del usuario (Administrador, Editor, Usuario)

## Niveles de permisos
- **Administrador**: Acceso total
- **Editor**: Publicaciones, comentarios, mensajes de contacto
- **Usuario**: Crear publicaciones, comentarios
- **Público**: Ver publicaciones, crear comentarios (requieren aprobación), enviar mensajes de contacto
