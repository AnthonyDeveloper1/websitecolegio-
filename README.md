# Sistema de Gestión Escolar - Monolito Next.js

Sistema completo de gestión web para instituciones educativas construido con Next.js 14, TypeScript, Prisma ORM y PostgreSQL.

## 🚀 Stack Tecnológico

- **Frontend & Backend**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT (jsonwebtoken + bcrypt)
- **Storage**: MinIO (dev) / S3 (producción)
- **Email**: Nodemailer
- **Estilos**: Tailwind CSS
- **Validación**: Zod
- **Contenedores**: Docker & Docker Compose

## 📁 Estructura del Proyecto

```
websitecolegio/
├── prisma/                    # Esquema y migraciones de BD
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── api/              # API Routes (backend)
│   │   ├── (public)/         # Rutas públicas
│   │   └── (admin)/          # Panel de administración
│   ├── components/            # Componentes React
│   ├── lib/                   # Utilidades y configuración
│   │   ├── prisma.ts         # Cliente Prisma
│   │   ├── auth.ts           # Autenticación JWT
│   │   ├── email.ts          # Servicio de email
│   │   ├── upload.ts         # Servicio de uploads
│   │   └── validations.ts    # Schemas Zod
│   └── middleware.ts          # Middleware de autenticación
├── scripts/                   # Scripts de utilidad
│   └── seed-admin.ts
├── docker/                    # Configuración Docker
├── docker-compose.yml
└── package.json
```

## 🛠️ Instalación y Configuración

### 1. Prerrequisitos

- Node.js 18+ 
- Docker & Docker Compose
- Git

### 2. Clonar el repositorio

```powershell
git clone <url-del-repo>
cd websitecolegio
```

### 3. Instalar dependencias

```powershell
npm install
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```powershell
Copy-Item .env.example .env.local
```

Edita `.env.local` con tus configuraciones.

### 5. Iniciar servicios con Docker

```powershell
# Iniciar PostgreSQL, MinIO y PgAdmin
npm run docker:up

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:down
```

Los servicios estarán disponibles en:
- **PostgreSQL**: `localhost:5432`
- **MinIO Console**: `http://localhost:9001` (user: minioadmin, pass: minioadmin123)
- **PgAdmin**: `http://localhost:5050` (user: admin@colegio.local, pass: admin123)

### 6. Ejecutar migraciones de Prisma

```powershell
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar BD con datos iniciales
npm run db:seed
```

### 7. Configurar bucket de MinIO (desarrollo)

1. Accede a MinIO Console: `http://localhost:9001`
2. Login: `minioadmin` / `minioadmin123`
3. Crea un bucket llamado `colegio-uploads`
4. Configura el bucket como público (Access Policy → Public)

### 8. Iniciar aplicación

```powershell
# Modo desarrollo
npm run dev

# Modo producción
npm run build
npm start
```

La aplicación estará en: `http://localhost:3000`

## 🔐 Credenciales por Defecto

Después de ejecutar el seed (`npm run db:seed`):

- **Admin**: `admin@colegio.edu` / `admin123`
- **Editor**: `editor@colegio.edu` / `editor123`

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Publicaciones
- `GET /api/publications` - Listar publicaciones
- `POST /api/publications` - Crear publicación (requiere auth)
- `GET /api/publications/[id]` - Obtener publicación
- `PUT /api/publications/[id]` - Actualizar publicación (requiere auth)
- `DELETE /api/publications/[id]` - Eliminar publicación (requiere auth)

### Test
- `GET /api/test` - Verificar estado del sistema

## 🗄️ Base de Datos

### Modelos principales

- **User**: Usuarios del sistema (admin, editor, user)
- **Category**: Categorías para publicaciones y galería
- **Publication**: Publicaciones (noticias, eventos, etc.)
- **Comment**: Comentarios en publicaciones
- **GalleryItem**: Elementos de la galería
- **ContactMessage**: Mensajes del formulario de contacto

### Comandos útiles de Prisma

```powershell
# Abrir Prisma Studio (GUI para la BD)
npm run db:studio

# Crear nueva migración
npm run db:migrate

# Resetear BD (¡cuidado en producción!)
npm run db:reset

# Generar cliente de Prisma
npm run db:generate
```

## 🚢 Despliegue en Vercel

### 1. Preparar base de datos en la nube

Usa un servicio gestionado de PostgreSQL:
- [Supabase](https://supabase.com) (recomendado, tier gratuito)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)
- [Render](https://render.com)

### 2. Configurar storage en la nube

Para archivos subidos, usa:
- AWS S3
- DigitalOcean Spaces
- Cloudinary

### 3. Variables de entorno en Vercel

En tu proyecto de Vercel, configura:

```
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_BUCKET=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASSWORD=...
```

### 4. Deploy

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### 5. Ejecutar migraciones en producción

```powershell
# Después del deploy, ejecutar:
npm run db:migrate:deploy
```

## 🧪 Testing

```powershell
# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Formateo de código
npm run format
```

## 📦 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Construye para producción |
| `npm start` | Inicia servidor de producción |
| `npm run db:generate` | Genera cliente de Prisma |
| `npm run db:migrate` | Ejecuta migraciones |
| `npm run db:seed` | Pobla BD con datos iniciales |
| `npm run db:studio` | Abre Prisma Studio |
| `npm run seed:admin` | Crea usuario admin interactivo |
| `npm run docker:up` | Inicia contenedores Docker |
| `npm run docker:down` | Detiene contenedores |
| `npm run docker:logs` | Muestra logs de Docker |

## 🔧 Solución de Problemas

### Error: Cannot connect to database

1. Verifica que Docker esté corriendo: `docker ps`
2. Verifica la variable `DATABASE_URL` en `.env.local`
3. Reinicia los contenedores: `npm run docker:down && npm run docker:up`

### Error: Prisma Client not generated

```powershell
npm run db:generate
```

### Error: Port 3000 already in use

```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Resetear completamente la BD

```powershell
npm run docker:down
npm run docker:clean
npm run docker:up
npm run db:migrate
npm run db:seed
```

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Contacto

Para soporte técnico, contacta a: admin@colegio.edu

---

**Desarrollado con ❤️ para la educación**
