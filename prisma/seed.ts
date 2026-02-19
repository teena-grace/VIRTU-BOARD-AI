// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  // Create teacher user
  const teacherPassword = await bcrypt.hash('teacher123', 12)
  await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: {},
    create: {
      email: 'teacher@test.com',
      password: teacherPassword,
      name: 'Teacher Demo',
      role: 'TEACHER'
    }
  })

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 12)
  await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      password: studentPassword,
      name: 'Student Demo',
      role: 'STUDENT'
    }
  })

  console.log('✅ Demo users created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })