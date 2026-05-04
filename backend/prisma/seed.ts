import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertUserWithEmployee(args: {
  email: string;
  password: string;
  role: 'ADMIN' | 'HR_MANAGER' | 'DEPARTMENT_HEAD' | 'EMPLOYEE';
  employee: {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    address?: string;
    department?: string;
    position?: string;
    salary: number;
  };
}) {
  const hashedPassword = await bcrypt.hash(args.password, 10);

  return prisma.user.upsert({
    where: { email: args.email },
    update: {
      password: hashedPassword,
      role: args.role,
      status: 'ACTIVE',
      resetToken: null,
      resetTokenExpiresAt: null,
      employee: {
        upsert: {
          update: {
            ...args.employee,
          },
          create: {
            ...args.employee,
          },
        },
      },
    },
    create: {
      email: args.email,
      password: hashedPassword,
      role: args.role,
      status: 'ACTIVE',
      employee: {
        create: {
          ...args.employee,
        },
      },
    },
  });
}

async function main() {
  console.log('Starting database seeding...');

  const admin = await upsertUserWithEmployee({
    email: 'admin@smarthr.com',
    password: 'admin123',
    role: 'ADMIN',
    employee: {
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      department: 'Management',
      position: 'System Administrator',
      salary: 100000,
    },
  });
  console.log('Created admin user:', admin.email);

  const hrManager = await upsertUserWithEmployee({
    email: 'hr@smarthr.com',
    password: 'hr123',
    role: 'HR_MANAGER',
    employee: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneNumber: '+1234567891',
      department: 'Human Resources',
      position: 'HR Manager',
      salary: 80000,
    },
  });
  console.log('Created HR manager:', hrManager.email);

  const departmentHead = await upsertUserWithEmployee({
    email: 'head.engineering@smarthr.com',
    password: 'head123',
    role: 'DEPARTMENT_HEAD',
    employee: {
      firstName: 'Michael',
      lastName: 'Perera',
      phoneNumber: '+1234567895',
      department: 'Engineering',
      position: 'Department Head',
      salary: 90000,
    },
  });
  console.log('Created department head:', departmentHead.email);

  const employee = await upsertUserWithEmployee({
    email: 'john.doe@smarthr.com',
    password: 'emp123',
    role: 'EMPLOYEE',
    employee: {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567892',
      dateOfBirth: new Date('1990-05-15'),
      address: '123 Main St, City, State 12345',
      department: 'Engineering',
      position: 'Software Engineer',
      salary: 75000,
    },
  });
  console.log('Created sample employee:', employee.email);

  const existingJobPosting = await prisma.jobPosting.findFirst({
    where: {
      title: 'Senior Software Engineer',
      department: 'Engineering',
    },
  });

  if (!existingJobPosting) {
    const jobPosting = await prisma.jobPosting.create({
      data: {
        title: 'Senior Software Engineer',
        department: 'Engineering',
        description: 'We are looking for an experienced software engineer to join our team.',
        requirements:
          "Bachelor's degree in Computer Science or related field. 5+ years of experience in software development.",
        salaryRange: '$90,000 - $120,000',
        location: 'San Francisco, CA',
        status: 'OPEN',
      },
    });

    console.log('Created sample job posting:', jobPosting.title);
  } else {
    console.log('Sample job posting already exists:', existingJobPosting.title);
  }

  console.log('Database seeding completed.');
  console.log('Test credentials:');
  console.log('Admin: admin@smarthr.com / admin123');
  console.log('HR Manager: hr@smarthr.com / hr123');
  console.log('Department Head: head.engineering@smarthr.com / head123');
  console.log('Employee: john.doe@smarthr.com / emp123');
}

main()
  .catch((error) => {
    console.error('Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
