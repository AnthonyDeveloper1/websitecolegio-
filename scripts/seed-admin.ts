/**
 * Script para crear un usuario administrador
 * Ejecutar con: npm run seed:admin
 */

import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('🔧 Creación de Usuario Administrador\n')

  const fullName = await question('Nombre completo: ')
  const username = await question('Usuario (username): ')
  const email = await question('Email: ')
  const password = await question('Contraseña: ')

  if (!fullName || !username || !email || !password) {
    console.error('❌ Todos los campos son obligatorios')
    process.exit(1)
  }

  // Verificar si el email ya existe
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUserByEmail) {
    console.error('❌ El email ya está registrado')
    process.exit(1)
  }

  // Verificar si el username ya existe
  const existingUserByUsername = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUserByUsername) {
    console.error('❌ El username ya está registrado')
    process.exit(1)
  }

  // Obtener o crear rol de Administrador
  let adminRole = await prisma.role.findUnique({
    where: { name: 'Administrador' },
  })

  if (!adminRole) {
    console.log('📋 Creando rol de Administrador...')
    adminRole = await prisma.role.create({
      data: {
        name: 'Administrador',
        description: 'Acceso total al sistema',
      },
    })
  }

  // Hash de la contraseña
  const hashedPassword = await hashPassword(password)

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  })

  console.log('\n✅ Usuario administrador creado exitosamente!')
  console.log(`   ID: ${admin.id}`)
  console.log(`   Nombre: ${admin.fullName}`)
  console.log(`   Usuario: ${admin.username}`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Rol: Administrador`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    rl.close()
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    rl.close()
    process.exit(1)
  })
