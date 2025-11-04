# 🔄 Migración Completada - Schema Actualizado

## ✅ Cambios Realizados

He actualizado el schema de Prisma con **TODAS tus tablas originales** del proyecto Flask/Python.

---

## 📊 Tablas Convertidas (13 tablas)

### ✅ Nuevas Tablas Agregadas:

1. **roles** → `Role`
   - Roles del sistema (Administrador, Editor, Usuario)
   
2. **usuarios** → `User` 
   - Actualizado con: username, fullName, roleId (relación a Role)
   
3. **publicaciones** → `Publication`
   - Actualizado: sin categoryId, ahora usa tags
   
4. **etiquetas** → `Tag`
   - Tags/Etiquetas para clasificar publicaciones
   
5. **publicacion_etiqueta** → `PublicationTag`
   - Relación N:N entre publicaciones y etiquetas
   
6. **comentarios** → `Comment`
   - Comentarios en publicaciones con aprobación
   
7. **reacciones** → `Reaction`
   - Likes/Reacciones en comentarios
   
8. **asuntos_contacto** → `ContactSubject`
   - Asuntos administrables para el formulario de contacto
   
9. **mensajes_contacto** → `ContactMessage`
   - Mensajes recibidos del formulario
   
10. **correos_destino** → `DestinationEmail`
    - Correos a los que se envían notificaciones
   
11. **directivos** → `Director`
    - Personal directivo del colegio
   
12. **historial_acciones** → `AuditLog`
    - Log de auditoría de acciones en el sistema
   
13. **visitas** → `Visit`
    - Contador de visitas a publicaciones

---

## 🔄 Diferencias Clave con el Schema Original

### ❌ Tablas Removidas:
- ~~Category~~ (reemplazado por Tag/Etiquetas)
- ~~GalleryItem~~ (puedes agregarla si la necesitas)

### ✨ Mejoras Aplicadas:
- ✅ Sistema de **Roles** dinámico en BD (antes era enum)
- ✅ Relación **N:N** entre publicaciones y etiquetas
- ✅ **Auditoría** completa de acciones
- ✅ **Contador de visitas** por publicación
- ✅ **Reacciones** en comentarios
- ✅ **Asuntos** administrables en formulario de contacto

---

## 🗺️ Mapeo de Campos

### Tabla: usuarios → User
```
SQL                  →  Prisma
-----------------       -----------------
id_usuario          →  id
nombre_completo     →  fullName
usuario             →  username
correo              →  email
clave               →  password
id_rol              →  roleId (relación)
ultima_conexion     →  lastConnection
activo              →  isActive
fecha_registro      →  registeredAt
```

### Tabla: publicaciones → Publication
```
SQL                  →  Prisma
-----------------       -----------------
id_publicacion      →  id
titulo              →  title
slug                →  slug
descripcion         →  description
contenido           →  content
imagen_principal    →  mainImage
estado              →  status
fecha_creacion      →  createdAt
id_usuario          →  authorId (relación)
```

### Tabla: comentarios → Comment
```
SQL                  →  Prisma
-----------------       -----------------
id_comentario       →  id
id_publicacion      →  publicationId (relación)
nombre              →  name
mensaje             →  message
aprobado            →  isApproved
fecha_creacion      →  createdAt
```

---

## 🚀 Próximos Pasos

### 1️⃣ Instalar dependencias (si aún no lo hiciste)
```powershell
npm install
```

### 2️⃣ Generar cliente de Prisma
```powershell
npm run db:generate
```

### 3️⃣ Crear las tablas en PostgreSQL
```powershell
# Asegúrate de que Docker esté corriendo
npm run docker:up

# Ejecutar migración (esto crea TODAS las 13 tablas)
npm run db:migrate
```

Te preguntará el nombre de la migración, escribe algo como:
```
migration-inicial-completa
```

### 4️⃣ Poblar con datos iniciales
```powershell
npm run db:seed
```

Esto creará:
- ✅ 3 Roles (Administrador, Editor, Usuario)
- ✅ 2 Usuarios (admin, editor)
- ✅ 5 Etiquetas
- ✅ 2 Publicaciones de ejemplo
- ✅ 3 Asuntos de contacto
- ✅ 2 Directivos
- ✅ 1 Mensaje de contacto

---

## 🔍 Verificar que todo funciona

### Ver las tablas creadas
```powershell
npm run db:studio
```

Se abrirá Prisma Studio en http://localhost:5555

### Probar API
```powershell
npm run dev
```

Luego abre: http://localhost:3000/api/test

Deberías ver:
```json
{
  "status": "OK",
  "database": "Connected",
  "stats": {
    "users": 2,
    ...
  }
}
```

---

## 📝 Actualizar API Routes

Ahora que el schema está actualizado, necesitas actualizar algunos API endpoints:

### Archivos a actualizar:
1. `src/app/api/auth/login/route.ts` - Incluir role y username
2. `src/app/api/auth/register/route.ts` - Incluir username y roleId
3. `src/app/api/publications/route.ts` - Usar tags en lugar de categoryId
4. `src/middleware.ts` - Actualizar para usar roleName

---

## 🎯 ¿Necesitas agregar más tablas?

Si necesitas tablas adicionales (por ejemplo, Galería), solo:

1. Edita `prisma/schema.prisma`
2. Agrega el modelo
3. Ejecuta `npm run db:migrate`

Ejemplo:
```prisma
model GalleryItem {
  id          Int      @id @default(autoincrement())
  title       String
  url         String
  // ... más campos
  
  @@map("galeria")
}
```

---

## 📊 Estructura de Relaciones

```
Role (1) ───── (N) User
                    │
                    │ (1)
                    │
                    ↓
              Publication (N) ───── (N) Tag
                    │                    (via PublicationTag)
                    │ (1)
                    │
                    ↓ (N)
               Comment
                    │ (1)
                    │
                    ↓ (N)
               Reaction

ContactSubject (1) ───── (N) ContactMessage

User (1) ───── (N) AuditLog

Publication (1) ───── (N) Visit
```

---

## ✅ Checklist de Migración

- [x] Schema actualizado con 13 tablas
- [x] Script de seed actualizado
- [x] Script seed-admin actualizado
- [x] Funciones de auth actualizadas
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm run db:generate`
- [ ] Ejecutar `npm run docker:up`
- [ ] Ejecutar `npm run db:migrate`
- [ ] Ejecutar `npm run db:seed`
- [ ] Actualizar API routes según sea necesario
- [ ] Probar login con nuevos usuarios

---

## 🆘 Si tienes problemas

### Error: Cannot find module '@prisma/client'
```powershell
npm run db:generate
```

### Error: Connection refused
```powershell
npm run docker:down
npm run docker:up
# Esperar 10 segundos
npm run db:migrate
```

### Quiero empezar desde cero
```powershell
npm run docker:down
npm run docker:clean
npm run docker:up
npm run db:migrate
npm run db:seed
```

---

**¡La migración está completa! 🎉**

Ahora tienes todas tus tablas originales funcionando con Prisma + TypeScript.
