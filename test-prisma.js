const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing Prisma connection...')
    const pubs = await prisma.publication.findMany()
    console.log('Publications:', pubs)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
