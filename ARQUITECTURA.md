# 🏗️ Arquitectura del Sistema

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR / CLIENTE                      │
│                    (React, Next.js Frontend)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS MONOLITO                            │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE LAYER                         │ │
│  │  • Autenticación JWT                                        │ │
│  │  • Verificación de roles                                    │ │
│  │  • CORS                                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────┬───────┴───────┬──────────────────┐        │
│  │                  │               │                  │        │
│  │  APP ROUTER      │   API ROUTES  │   SERVER ACTIONS │        │
│  │  (Pages/UI)      │   (Backend)   │   (Server-Side)  │        │
│  │                  │               │                  │        │
│  │  • /             │   • /api/auth │   • Form Actions │        │
│  │  • /noticias     │   • /api/pub  │   • DB queries   │        │
│  │  • /admin        │   • /api/gal  │   • Validations  │        │
│  └──────────────────┴───────┬───────┴──────────────────┘        │
│                             │                                    │
│  ┌──────────────────────────┴────────────────────────────────┐  │
│  │                      LIB LAYER                             │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Prisma   │  │   Auth   │  │  Upload  │  │  Email   │  │  │
│  │  │ Client   │  │   JWT    │  │  S3/Minio│  │Nodemailer│  │  │
│  │  └────┬─────┘  └──────────┘  └────┬─────┘  └──────────┘  │  │
│  │       │                            │                      │  │
│  └───────┼────────────────────────────┼──────────────────────┘  │
└──────────┼────────────────────────────┼─────────────────────────┘
           │                            │
           │                            │
┌──────────▼────────────┐    ┌──────────▼────────────┐
│                       │    │                       │
│   POSTGRESQL 15       │    │   MINIO / S3          │
│   (Base de Datos)     │    │   (Object Storage)    │
│                       │    │                       │
│  • users              │    │  • Images             │
│  • publications       │    │  • Documents          │
│  • categories         │    │  • Videos             │
│  • gallery_items      │    │                       │
│  • comments           │    │  Bucket:              │
│  • contact_messages   │    │  colegio-uploads      │
│                       │    │                       │
│  Puerto: 5432         │    │  Puerto: 9000         │
│  Container: postgres  │    │  Container: minio     │
└───────────────────────┘    └───────────────────────┘
```

## 🔄 Flujo de Peticiones

### 1. Petición de Usuario Público (Lectura)

```
Usuario → GET /noticias 
    ↓
Next.js App Router (page.tsx)
    ↓
Fetch → GET /api/publications?isPublished=true
    ↓
API Route (route.ts)
    ↓
Prisma Client
    ↓
PostgreSQL → SELECT * FROM publications WHERE is_published = true
    ↓
Response JSON
    ↓
React Component (renderiza)
    ↓
Usuario ve las noticias
```

### 2. Petición Autenticada (Escritura)

```
Admin → POST /api/publications (crear noticia)
    ↓
Middleware verifica JWT token
    ↓
Extrae userId, role de token
    ↓
API Route recibe request con headers:
    • x-user-id
    • x-user-role
    ↓
Valida datos con Zod schema
    ↓
Prisma Client → INSERT INTO publications
    ↓
PostgreSQL guarda el registro
    ↓
Response: Publication creada
    ↓
Admin ve confirmación
```

### 3. Upload de Archivo

```
Usuario → Selecciona imagen
    ↓
POST /api/upload (FormData)
    ↓
Middleware verifica autenticación
    ↓
API Route:
    • Valida tipo de archivo
    • Valida tamaño
    • Genera nombre único
    ↓
upload.ts (lib)
    ↓
S3 Client (AWS SDK)
    ↓
MinIO/S3 → Almacena archivo
    ↓
Retorna URL pública
    ↓
Prisma Client → INSERT INTO gallery_items
    ↓
Response: { url, filename }
    ↓
Usuario ve imagen subida
```

## 🔐 Sistema de Autenticación

```
┌──────────────────────────────────────────────────────────┐
│                   PROCESO DE LOGIN                        │
└──────────────────────────────────────────────────────────┘

1. POST /api/auth/login
   Body: { email, password }
        ↓
2. Buscar usuario en DB
   prisma.user.findUnique({ where: { email } })
        ↓
3. Verificar contraseña
   bcrypt.compare(password, user.password)
        ↓
4. Generar JWT
   jwt.sign({ userId, email, role }, SECRET)
        ↓
5. Retornar token
   Response: { token, user }
        ↓
6. Cliente guarda token
   localStorage.setItem('token', token)
        ↓
7. Peticiones futuras incluyen token
   Authorization: Bearer <token>
        ↓
8. Middleware verifica token
   jwt.verify(token, SECRET)
        ↓
9. Extrae info del usuario
   { userId, email, role }
        ↓
10. Inyecta en headers
    x-user-id, x-user-role
        ↓
11. API Routes usan info
    const userId = headers.get('x-user-id')
```

## 🗄️ Modelo de Datos (Relaciones)

```
User (usuarios)
├─┬─ id, email, password, name, role
│ │
│ ├── publications (1:N) → authorId
│ ├── galleryItems (1:N) → uploadedById
│ └── comments (1:N) → authorId
│
│
Category (categorías)
├─┬─ id, name, slug, color
│ │
│ ├── publications (1:N) → categoryId
│ └── galleryItems (1:N) → categoryId
│
│
Publication (publicaciones)
├─┬─ id, title, slug, content, isPublished
│ │
│ ├── author (N:1) → User
│ ├── category (N:1) → Category
│ └── comments (1:N)
│
│
Comment (comentarios)
├─┬─ id, content, isApproved
│ │
│ ├── author (N:1) → User (nullable)
│ ├── publication (N:1) → Publication
│ └── guestName, guestEmail (para usuarios no registrados)
│
│
GalleryItem (galería)
├─┬─ id, title, filename, url
│ │
│ ├── category (N:1) → Category (nullable)
│ └── uploadedBy (N:1) → User
│
│
ContactMessage (mensajes)
└─── id, name, email, subject, message, isRead, isResolved
```

## 🚀 Deployment Architecture (Vercel)

```
┌─────────────────────────────────────────────────────────┐
│                      VERCEL PLATFORM                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Edge Network (CDN)                      │  │
│  │  • Static files                                   │  │
│  │  • Images optimization                            │  │
│  │  • Caching                                        │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼───────────────────────────────┐  │
│  │      Serverless Functions (Lambda)                │  │
│  │  • /api/auth/*                                    │  │
│  │  • /api/publications/*                            │  │
│  │  • /api/upload/*                                  │  │
│  │  • Auto-scaling                                   │  │
│  │  • 10s timeout (hobby) / 60s (pro)               │  │
│  └───────────┬────────────────┬──────────────────────┘  │
└──────────────┼────────────────┼─────────────────────────┘
               │                │
               │                │
    ┌──────────▼─────────┐   ┌─▼────────────────┐
    │   PostgreSQL       │   │  S3 / Spaces     │
    │   (External)       │   │  (External)      │
    │                    │   │                  │
    │  • Supabase        │   │  • AWS S3        │
    │  • Neon            │   │  • DO Spaces     │
    │  • Railway         │   │  • Cloudinary    │
    │  • Render          │   │                  │
    └────────────────────┘   └──────────────────┘
```

## 📊 Flujo de Desarrollo vs Producción

### Desarrollo (Local)
```
Developer Machine
    ├── Next.js Dev Server (npm run dev)
    │   └── Hot Reload, Source Maps
    │
    ├── Docker Compose
    │   ├── PostgreSQL (localhost:5432)
    │   ├── MinIO (localhost:9000)
    │   └── PgAdmin (localhost:5050)
    │
    └── Prisma Studio (npm run db:studio)
        └── Database GUI
```

### Producción (Vercel)
```
Vercel
    ├── Next.js Production Build
    │   ├── Static pages (pre-rendered)
    │   ├── Server components
    │   └── API routes (serverless)
    │
    ├── External PostgreSQL
    │   └── Supabase / Neon / Railway
    │
    ├── External Storage
    │   └── AWS S3 / DO Spaces
    │
    └── Email Service
        └── SendGrid / Mailgun
```

## 🔧 Scripts y Comandos

```
Development Workflow:

1. Setup inicial
   npm install
   npm run docker:up
   npm run db:migrate
   npm run db:seed

2. Desarrollo diario
   npm run docker:up     (si no está corriendo)
   npm run dev

3. Cambios en schema
   • Editar prisma/schema.prisma
   npm run db:migrate
   npm run db:generate

4. Poblar/Resetear datos
   npm run db:reset
   npm run db:seed

5. Ver datos
   npm run db:studio

Production Deployment:

1. Build local (test)
   npm run build
   npm start

2. Deploy a Vercel
   vercel
   vercel --prod

3. Migraciones en producción
   vercel env pull .env.production
   npx prisma migrate deploy
```

---

**Esta arquitectura permite**:
- ✅ Desarrollo local completo con Docker
- ✅ API RESTful y Server Actions
- ✅ Autenticación robusta con JWT
- ✅ Upload de archivos a cloud storage
- ✅ Deploy fácil a Vercel
- ✅ Escalabilidad con serverless
- ✅ TypeScript end-to-end
