(async ()=>{
  try{
    const { PrismaClient } = require('@prisma/client')
    const { compare } = require('bcryptjs')
    const prisma = new PrismaClient()
    const email = 'admin.sa@colegio.edu'
    const password = 'admin123'
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user){ console.log('NO USER') ; await prisma.$disconnect(); process.exit(0)}
    console.log('User found:', user.email, 'isActive=', user.isActive)
    const ok = await compare(password, user.password)
    console.log('bcrypt compare result:', ok)
    await prisma.$disconnect()
  }catch(e){ console.error(e); process.exit(1)}
})();
