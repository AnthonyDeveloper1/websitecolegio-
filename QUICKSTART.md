# 🚀 Inicio Rápido - Quick Start

## 📦 Instalación (Primera vez)

```powershell
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
Copy-Item .env.example .env.local

# 3. Iniciar servicios Docker (PostgreSQL, MinIO, PgAdmin)
npm run docker:up

# 4. Generar cliente Prisma
npm run db:generate

# 5. Crear tablas en la base de datos
npm run db:migrate

# 6. Poblar con datos de ejemplo
npm run db:seed

# 7. Iniciar aplicación
npm run dev
```

Abre http://localhost:3000

## 🔐 Credenciales por defecto

- **Admin**: `admin@colegio.edu` / `admin123`
- **Editor**: `editor@colegio.edu` / `editor123`

## 🔧 Configurar MinIO (Storage de archivos)

1. Abre http://localhost:9001
2. Login: `minioadmin` / `minioadmin123`
3. Crea bucket: `colegio-uploads`
4. Haz el bucket público (Settings → Access Policy → Public)

## 📊 Herramientas disponibles

- **Aplicación**: http://localhost:3000
- **API Test**: http://localhost:3000/api/test
- **MinIO Console**: http://localhost:9001
- **PgAdmin**: http://localhost:5050
- **Prisma Studio**: `npm run db:studio`

## 🛑 Detener servicios

```powershell
# Detener Docker
npm run docker:down

# Detener Next.js
Ctrl + C en la terminal donde corre
```

## 🔄 Día a día (comandos comunes)

```powershell
# Iniciar todo
npm run docker:up
npm run dev

# Ver logs de Docker
npm run docker:logs

# Abrir base de datos (GUI)
npm run db:studio

# Resetear base de datos
npm run db:reset
npm run db:seed
```

## ⚠️ Solución de problemas

### Error: Cannot connect to database
```powershell
npm run docker:down
npm run docker:up
# Esperar 10 segundos
npm run db:migrate
```

### Error: Prisma Client not found
```powershell
npm run db:generate
```

### Puerto 3000 ocupado
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

## 📚 Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar en desarrollo |
| `npm run build` | Compilar para producción |
| `npm run docker:up` | Iniciar PostgreSQL, MinIO |
| `npm run docker:down` | Detener servicios |
| `npm run db:migrate` | Ejecutar migraciones |
| `npm run db:seed` | Poblar datos |
| `npm run db:studio` | Abrir Prisma Studio |
| `npm run seed:admin` | Crear admin |

## 🎯 Próximos pasos

1. ✅ Revisa el README.md completo
2. ✅ Explora la estructura en `src/app/api/`
3. ✅ Prueba los endpoints en Postman/Thunder Client
4. ✅ Personaliza el esquema en `prisma/schema.prisma`
5. ✅ Crea tus componentes en `src/components/`

---

**¿Problemas?** Revisa el README.md completo o los logs con `npm run docker:logs`
