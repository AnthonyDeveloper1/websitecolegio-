/**
 * Script de seed para poblar la base de datos con datos iniciales
 * Ejecutar con: npm run db:seed
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // 1. Crear roles
  console.log('👥 Creando roles...')
  
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: {
      name: 'Administrador',
      description: 'Acceso total al sistema',
    },
  })

  const editorRole = await prisma.role.upsert({
    where: { name: 'Editor' },
    update: {},
    create: {
      name: 'Editor',
      description: 'Puede crear y editar publicaciones',
    },
  })

  const userRole = await prisma.role.upsert({
    where: { name: 'Usuario' },
    update: {},
    create: {
      name: 'Usuario',
      description: 'Usuario básico del sistema',
    },
  })

  console.log(`✅ Roles creados: ${adminRole.name}, ${editorRole.name}, ${userRole.name}`)

  // 2. Crear usuarios
  console.log('👤 Creando usuarios...')
  
  const adminPassword = await hashPassword('admin123')
  const editorPassword = await hashPassword('editor123')
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@colegio.edu' },
    update: {},
    create: {
      fullName: 'Administrador del Sistema',
      username: 'admin',
      email: 'admin@colegio.edu',
      password: adminPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  })

  const editor = await prisma.user.upsert({
    where: { email: 'editor@colegio.edu' },
    update: {},
    create: {
      fullName: 'Editor Principal',
      username: 'editor',
      email: 'editor@colegio.edu',
      password: editorPassword,
      roleId: editorRole.id,
      isActive: true,
    },
  })

  console.log(`✅ Usuarios creados: ${admin.fullName}, ${editor.fullName}`)

  // 3. Crear etiquetas (tags)
  console.log('🏷️  Creando etiquetas...')
  
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'Noticias' },
      update: {},
      create: { name: 'Noticias', slug: 'noticias' },
    }),
    prisma.tag.upsert({
      where: { name: 'Eventos' },
      update: {},
      create: { name: 'Eventos', slug: 'eventos' },
    }),
    prisma.tag.upsert({
      where: { name: 'Académico' },
      update: {},
      create: { name: 'Académico', slug: 'academico' },
    }),
    prisma.tag.upsert({
      where: { name: 'Deportes' },
      update: {},
      create: { name: 'Deportes', slug: 'deportes' },
    }),
    prisma.tag.upsert({
      where: { name: 'Cultura' },
      update: {},
      create: { name: 'Cultura', slug: 'cultura' },
    }),
  ])

  console.log(`✅ Etiquetas creadas: ${tags.length}`)

  // 4. Crear publicaciones de ejemplo
  console.log('📝 Creando publicaciones...')
  
  const pub1 = await prisma.publication.create({
    data: {
      title: 'Bienvenidos al año escolar 2025',
      slug: 'bienvenidos-ano-escolar-2025',
      description: 'Iniciamos un nuevo año lleno de oportunidades y aprendizaje',
      content: `
        <h2>Estimada comunidad educativa,</h2>
        <p>Es un placer darles la bienvenida al año escolar 2025. Este año trae consigo nuevos retos y oportunidades para el crecimiento académico y personal de nuestros estudiantes.</p>
        <p>Hemos preparado un programa educativo innovador que integra tecnología, valores y excelencia académica.</p>
        <p>¡Les deseamos un año exitoso!</p>
      `,
      status: 'publicado',
      authorId: admin.id,
    },
  })

  const pub2 = await prisma.publication.create({
    data: {
      title: 'Torneo Deportivo Interescolar 2025',
      slug: 'torneo-deportivo-interescolar-2025',
      description: 'Nuestro colegio participará en el torneo deportivo regional',
      content: `
        <h2>Gran Torneo Deportivo</h2>
        <p>Nos complace anunciar que nuestro colegio participará en el Torneo Deportivo Interescolar Regional 2025.</p>
        <p>Las disciplinas incluidas son: fútbol, básquetbol, voleibol y atletismo.</p>
        <p>¡Apoyemos a nuestros estudiantes atletas!</p>
      `,
      status: 'publicado',
      authorId: editor.id,
    },
  })

  // Asignar etiquetas a publicaciones
  await prisma.publicationTag.createMany({
    data: [
      { publicationId: pub1.id, tagId: tags[0].id }, // Noticias
      { publicationId: pub1.id, tagId: tags[2].id }, // Académico
      { publicationId: pub2.id, tagId: tags[1].id }, // Eventos
      { publicationId: pub2.id, tagId: tags[3].id }, // Deportes
    ],
  })

  console.log(`✅ Publicaciones creadas: 2`)

  // 5. Crear asuntos de contacto
  console.log('📋 Creando asuntos de contacto...')
  
  const subjects = await Promise.all([
    prisma.contactSubject.upsert({
      where: { name: 'Información General' },
      update: {},
      create: {
        name: 'Información General',
        description: 'Consultas generales sobre el colegio',
      },
    }),
    prisma.contactSubject.upsert({
      where: { name: 'Inscripciones' },
      update: {},
      create: {
        name: 'Inscripciones',
        description: 'Preguntas sobre el proceso de inscripción',
      },
    }),
    prisma.contactSubject.upsert({
      where: { name: 'Sugerencias' },
      update: {},
      create: {
        name: 'Sugerencias',
        description: 'Sugerencias y comentarios',
      },
    }),
  ])

  console.log(`✅ Asuntos de contacto creados: ${subjects.length}`)

  // 6. Crear mensaje de contacto de ejemplo
  console.log('✉️  Creando mensajes de contacto...')
  
  await prisma.contactMessage.create({
    data: {
      name: 'María González',
      email: 'maria@example.com',
      subjectId: subjects[1].id,
      message: '¿Cuál es el proceso de inscripción para el próximo año escolar?',
      isReplied: false,
    },
  })

  console.log('✅ Mensajes de contacto creados')

  // 7. Crear correos de destino
  console.log('📧 Creando correos de destino...')
  
  await prisma.destinationEmail.upsert({
    where: { email: 'info@colegio.edu' },
    update: {},
    create: {
      name: 'Correo Principal',
      email: 'info@colegio.edu',
      isActive: true,
    },
  })

  console.log('✅ Correos de destino creados')

  // 8. Crear directivos
  console.log('👔 Creando directivos...')
  
  const directors = await Promise.all([
    prisma.director.create({
      data: {
        fullName: 'Dr. Juan Pérez',
        position: 'Director General',
        description: 'Director con más de 20 años de experiencia en educación',
        status: 'activo',
      },
    }),
    prisma.director.create({
      data: {
        fullName: 'Lic. Ana Martínez',
        position: 'Subdirectora Académica',
        description: 'Especialista en pedagogía y desarrollo curricular',
        status: 'activo',
      },
    }),
  ])

  console.log(`✅ Directivos creados: ${directors.length}`)

  console.log('\n🎉 Seed completado exitosamente!')
  console.log('\n📋 Credenciales de acceso:')
  console.log('   Admin:  admin@colegio.edu / admin123')
  console.log('   Editor: editor@colegio.edu / editor123')
  console.log('\n📊 Resumen:')
  console.log(`   • ${3} Roles`)
  console.log(`   • ${2} Usuarios`)
  console.log(`   • ${tags.length} Etiquetas`)
  console.log(`   • ${2} Publicaciones`)
  console.log(`   • ${subjects.length} Asuntos de contacto`)
  console.log(`   • ${directors.length} Directivos`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
