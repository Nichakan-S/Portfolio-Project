import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        rank: true,
        faculty: true,
        major: true
      }
    });
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Error fetching users' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const { email, password, prefix, username, lastname, facultyId, majorId, rankId, user_image, role } = await request.json();
    if (!email || !password || !prefix || !username || !lastname || !facultyId || !majorId || !rankId || !role) {
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
        role
      },
    });
    return new Response(JSON.stringify({ message: 'User created', newUser }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

