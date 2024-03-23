import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password} = await request.json();
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    const NewAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return new Response(JSON.stringify({ message: 'User created', NewAdmin }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500 });
  }
}
