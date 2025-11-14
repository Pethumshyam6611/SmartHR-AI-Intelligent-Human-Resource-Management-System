import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smarthr.com' },
    update: {},
    create: {
      email: 'admin@smarthr.com',
      password: adminPassword,
      role: 'ADMIN',
      employee: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          phoneNumber: '+1234567890',
          department: 'Management',
          position: 'System Administrator',
          salary: 100000,
        },
      },
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Create HR Manager user
  const hrPassword = await bcrypt.hash('hr123', 10);
  const hrManager = await prisma.user.upsert({
    where: { email: 'hr@smarthr.com' },
    update: {},
    create: {
      email: 'hr@smarthr.com',
      password: hrPassword,
      role: 'HR_MANAGER',
      employee: {
        create: {
          firstName: 'Sarah',
          lastName: 'Johnson',
          phoneNumber: '+1234567891',
          department: 'Human Resources',
          position: 'HR Manager',
          salary: 80000,
        },
      },
    },
  });

  console.log('✅ Created HR Manager:', hrManager.email);

  // Create sample employee
  const empPassword = await bcrypt.hash('emp123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'john.doe@smarthr.com' },
    update: {},
    create: {
      email: 'john.doe@smarthr.com',
      password: empPassword,
      role: 'EMPLOYEE',
      employee: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+1234567892',
          dateOfBirth: new Date('1990-05-15'),
          address: '123 Main St, City, State 12345',
          department: 'Engineering',
          position: 'Software Engineer',
          salary: 75000,
        },
      },
    },
  });

  console.log('✅ Created sample employee:', employee.email);

  // Create sample job posting
  const jobPosting = await prisma.jobPosting.create({
    data: {
      title: 'Senior Software Engineer',
      department: 'Engineering',
      description: 'We are looking for an experienced software engineer to join our team.',
      requirements: 'Bachelor\'s degree in Computer Science or related field. 5+ years of experience in software development.',
      salaryRange: '$90,000 - $120,000',
      location: 'San Francisco, CA',
      status: 'OPEN',
    },
  });

  console.log('✅ Created sample job posting:', jobPosting.title);

  console.log('🎉 Database seeding completed!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin: admin@smarthr.com / admin123');
  console.log('HR Manager: hr@smarthr.com / hr123');
  console.log('Employee: john.doe@smarthr.com / emp123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
