import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, prefix, username, lastname, facultyId, majorId, rankId, user_image } = await request.json();
    if (!email || !password || !prefix || !username || !lastname || !facultyId || !majorId || !rankId) {
      throw new Error('All required fields must be provided');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        prefix,
        username,
        lastname,
        facultyId,
        majorId,
        rankId,
        user_image,
      },
    });
    return new Response(JSON.stringify({ message: 'User created', newUser }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
