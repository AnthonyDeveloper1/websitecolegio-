(async ()=>{
  try{
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    const hash = '$2a$10$z0UUAdHtnl.zhnmWgXTw2.Kc98/YbvgrSIIFOfBvuf/5c7nsJjlTK'
    const user = await prisma.user.update({ where: { email: 'admin.sa@colegio.edu' }, data: { password: hash } })
    console.log('updated', user.email)
    await prisma.$disconnect()
  }catch(e){
    console.error('error', e)
    process.exit(1)
  }
})();
