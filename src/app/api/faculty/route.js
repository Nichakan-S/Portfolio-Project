import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { facultyName } = await request.json();
    if (!facultyName) {
      throw new Error('facultyName are required');
    }
    const NewFaculty = await prisma.faculty.create({
      data: {
        facultyName,
      },
    });
    return new Response(JSON.stringify({ message: 'User created', NewFaculty }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500 });
  }
}