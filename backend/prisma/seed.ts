import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

function requiredSeedEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required seed env var: ${key}`);
  }
  return value;
}

async function main() {
  console.log('Seeding database...');

  const adminName = requiredSeedEnv('SEED_ADMIN_NAME');
  const adminEmail = requiredSeedEnv('SEED_ADMIN_EMAIL').toLowerCase();
  const adminMobile = requiredSeedEnv('SEED_ADMIN_MOBILE');
  const adminPassword = requiredSeedEnv('SEED_ADMIN_PASSWORD');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
    throw new Error('SEED_ADMIN_EMAIL must be a valid email address');
  }
  if (!/^\d{7,15}$/.test(adminMobile)) {
    throw new Error('SEED_ADMIN_MOBILE must contain 7 to 15 digits');
  }
  if (adminPassword.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters');
  }

  let superAdminRole = await prisma.role.findFirst({
    where: { roleName: 'Super Admin' },
  });

  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        roleName: 'Super Admin',
        permissionIds: [],
      },
    });
    console.log(`Created role: ${superAdminRole.roleName} (id: ${superAdminRole.id})`);
  } else {
    console.log(`Role already exists: ${superAdminRole.roleName} (id: ${superAdminRole.id})`);
  }

  const accessStartDate = new Date();
  const accessEndDate = new Date();
  accessEndDate.setFullYear(accessEndDate.getFullYear() + 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    const admin = await prisma.adminUser.update({
      where: { id: existingAdmin.id },
      data: {
        name: adminName,
        mobile: adminMobile,
        roleId: superAdminRole.id,
        status: 'active',
      },
    });

    console.log(`Existing admin updated without changing password (id: ${admin.id})`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    const admin = await prisma.adminUser.create({
      data: {
        name: adminName,
        email: adminEmail,
        mobile: adminMobile,
        passwordHash,
        roleId: superAdminRole.id,
        status: 'active',
        accessStartDate,
        accessEndDate,
      },
    });

    console.log(`New admin created successfully (id: ${admin.id})`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
