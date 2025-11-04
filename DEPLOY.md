# Deploy a Vercel - Instrucciones

## Variables de Entorno Requeridas

Configura estas variables en Vercel Dashboard → Settings → Environment Variables:

### Base de Datos
```
DATABASE_URL=postgresql://usuario:password@host:5432/database_name?sslmode=require
```

### JWT
```
JWT_SECRET=tu-secreto-super-seguro-aleatorio-aqui
JWT_EXPIRES_IN=7d
```

### S3/MinIO (Producción)
```
S3_REGION=us-east-1
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=tu-bucket-name
S3_ACCESS_KEY=tu-access-key
S3_SECRET_KEY=tu-secret-key
```

### Email (Opcional)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password
```

## Pasos para Deploy

1. **Push a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

2. **Importar en Vercel**
- Ve a https://vercel.com/new
- Importa tu repositorio de GitHub
- Vercel detectará automáticamente Next.js

3. **Configurar Variables**
- Agrega todas las variables de entorno listadas arriba
- Marca las sensibles como "Sensitive"

4. **Deploy**
- Click "Deploy"
- Vercel ejecutará: `npm install` → `prisma generate` → `next build`

5. **Configurar Base de Datos**
Puedes usar:
- **Vercel Postgres** (Neon) - Gratis hasta 512MB
- **Supabase** - Gratis hasta 500MB
- **Railway** - PostgreSQL gratis
- **PlanetScale** - MySQL serverless

6. **Configurar S3**
Puedes usar:
- **AWS S3** - Pay as you go
- **Cloudflare R2** - 10GB gratis/mes
- **Backblaze B2** - 10GB gratis/mes

## Build Command
```
prisma generate && prisma migrate deploy && next build
```

## Verificar Deploy
```
https://tu-proyecto.vercel.app/api/test
```

## Troubleshooting

### Error: Prisma Client
Asegúrate que `postinstall: prisma generate` esté en package.json

### Error: DATABASE_URL
Verifica que la URL incluya `?sslmode=require` para conexiones SSL

### Error: S3
Verifica las credenciales y permisos del bucket

### Error: Build Timeout
Si el build toma mucho, considera:
- Optimizar dependencias
- Usar cache de Vercel
- Reducir archivos estáticos
