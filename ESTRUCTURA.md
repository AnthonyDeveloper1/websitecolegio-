# 📋 ESTRUCTURA DEL PROYECTO

```
websitecolegio/
│
├── 📄 docker-compose.yml              # Orquestación Docker (PostgreSQL, MinIO, PgAdmin)
├── 📄 .env.example                    # Plantilla de variables de entorno
├── 📄 .gitignore                      # Archivos ignorados por Git
├── 📄 package.json                    # Dependencies y scripts
├── 📄 tsconfig.json                   # Configuración TypeScript
├── 📄 next.config.js                  # Configuración Next.js
├── 📄 tailwind.config.ts              # Configuración Tailwind CSS
├── 📄 postcss.config.js               # Configuración PostCSS
├── 📄 README.md                       # Documentación completa
├── 📄 QUICKSTART.md                   # Guía de inicio rápido
│
├── 📁 prisma/                         # 🗄️ ORM y Base de Datos
│   ├── schema.prisma                  # ⭐ Modelos de datos (Users, Publications, etc)
│   ├── seed.ts                        # Script para datos iniciales
│   └── migrations/                    # Historial de migraciones (auto-generado)
│
├── 📁 src/                            # 🎯 Código fuente de la aplicación
│   │
│   ├── 📁 app/                        # Next.js App Router (Páginas y API)
│   │   ├── layout.tsx                 # Layout principal
│   │   ├── page.tsx                   # Home page
│   │   ├── globals.css                # Estilos globales
│   │   │
│   │   ├── 📁 api/                    # 🔌 API Routes (Backend)
│   │   │   │
│   │   │   ├── 📁 auth/               # Autenticación
│   │   │   │   ├── login/route.ts     # POST /api/auth/login
│   │   │   │   └── register/route.ts  # POST /api/auth/register
│   │   │   │
│   │   │   ├── 📁 publications/       # Publicaciones
│   │   │   │   ├── route.ts           # GET/POST /api/publications
│   │   │   │   └── [id]/route.ts      # GET/PUT/DELETE /api/publications/:id
│   │   │   │
│   │   │   ├── categories/route.ts    # Categorías
│   │   │   ├── gallery/route.ts       # Galería
│   │   │   ├── contact-messages/route.ts  # Mensajes contacto
│   │   │   ├── users/route.ts         # Usuarios
│   │   │   ├── upload/route.ts        # Subida de archivos
│   │   │   ├── dashboard/route.ts     # Dashboard stats
│   │   │   └── test/route.ts          # ⭐ Endpoint de prueba
│   │   │
│   │   ├── 📁 (public)/               # Rutas públicas (sin autenticación)
│   │   │   ├── noticias/
│   │   │   ├── galeria/
│   │   │   └── contacto/
│   │   │
│   │   └── 📁 (admin)/                # Rutas protegidas (admin)
│   │       ├── layout.tsx             # Layout con verificación de auth
│   │       ├── dashboard/
│   │       ├── publicaciones/
│   │       └── usuarios/
│   │
│   ├── 📁 components/                 # 🧩 Componentes React reutilizables
│   │   ├── ui/                        # Componentes base (Button, Card, Input)
│   │   ├── layout/                    # Header, Footer, Sidebar, Navbar
│   │   ├── forms/                     # Formularios (Login, Contact, etc)
│   │   └── publication/               # Componentes de publicaciones
│   │
│   ├── 📁 lib/                        # 🛠️ Utilidades y configuración
│   │   ├── prisma.ts                  # ⭐ Cliente Prisma (singleton)
│   │   ├── auth.ts                    # ⭐ JWT, hash passwords
│   │   ├── email.ts                   # ⭐ Servicio de email (Nodemailer)
│   │   ├── upload.ts                  # ⭐ Upload a S3/MinIO
│   │   ├── validations.ts             # ⭐ Schemas Zod para validación
│   │   └── utils.ts                   # Helpers generales
│   │
│   ├── 📁 types/                      # 📝 TypeScript types & interfaces
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   └── middleware.ts                  # ⭐ Middleware de Next.js (auth, CORS)
│
├── 📁 scripts/                        # 🔧 Scripts de utilidad
│   ├── seed-admin.ts                  # ⭐ Crear usuario admin interactivo
│   ├── migrate-data.ts                # Migración desde Python/Flask
│   └── backup-db.ts                   # Backup de base de datos
│
├── 📁 docker/                         # 🐳 Configuración Docker
│   └── postgres/
│       └── init.sql                   # Script de inicialización de PostgreSQL
│
├── 📁 public/                         # 📦 Archivos estáticos públicos
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
└── 📁 uploads/                        # 📸 Almacenamiento local (solo desarrollo)
    └── .gitkeep                       # Mantener carpeta en git

```

## 🔑 Archivos clave (⭐)

### Backend / API
- `src/lib/prisma.ts` - Cliente de base de datos
- `src/lib/auth.ts` - Autenticación JWT
- `src/lib/upload.ts` - Subida de archivos S3/MinIO
- `src/lib/email.ts` - Envío de emails
- `src/lib/validations.ts` - Validación de datos (Zod)
- `src/middleware.ts` - Protección de rutas

### Base de Datos
- `prisma/schema.prisma` - Definición de modelos
- `prisma/seed.ts` - Datos iniciales

### API Endpoints
- `src/app/api/auth/` - Login, registro
- `src/app/api/publications/` - CRUD publicaciones
- `src/app/api/test/route.ts` - Test de conexión

### Configuración
- `docker-compose.yml` - Servicios (PostgreSQL, MinIO)
- `.env.example` - Variables de entorno
- `package.json` - Scripts y dependencias

## 📊 Modelos de la Base de Datos

### User
- id, email, password (hash), name, role, isActive
- Roles: ADMIN, EDITOR, USER

### Category
- id, name, slug, description, color, icon

### Publication
- id, title, slug, content, excerpt, coverImage
- isPublished, isFeatured, publishedAt
- authorId → User, categoryId → Category

### Comment
- id, content, isApproved
- authorId → User, publicationId → Publication
- guestName, guestEmail (para no registrados)

### GalleryItem
- id, title, description, filename, url
- fileType, fileSize
- categoryId → Category, uploadedById → User

### ContactMessage
- id, name, email, phone, subject, message
- isRead, isResolved, notes

## 🔌 Servicios Docker

| Servicio | Puerto | Usuario | Contraseña | URL |
|----------|--------|---------|------------|-----|
| PostgreSQL | 5432 | colegio_user | colegio_pass | localhost:5432 |
| MinIO API | 9000 | minioadmin | minioadmin123 | localhost:9000 |
| MinIO Console | 9001 | minioadmin | minioadmin123 | http://localhost:9001 |
| PgAdmin | 5050 | admin@colegio.local | admin123 | http://localhost:5050 |

## 🚀 Stack Completo

**Frontend**: Next.js 14, React 18, TypeScript 5  
**Backend**: Next.js API Routes (serverless)  
**Base de Datos**: PostgreSQL 15 + Prisma ORM  
**Autenticación**: JWT (jsonwebtoken + bcrypt)  
**Storage**: MinIO (dev) / S3 (prod)  
**Email**: Nodemailer / SendGrid  
**Validación**: Zod  
**Estilos**: Tailwind CSS 3  
**Deployment**: Vercel (recomendado)  

---

**Para comenzar**: Ver `QUICKSTART.md` 🚀
