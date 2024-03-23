import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { facultyId, majorName } = await request.json();
    if (!facultyId || !majorName) {
      throw new Error('facultyId are required');
    }
    const NewMajor = await prisma.major.create({
      data: {
        facultyId,
        majorName
      },
    });
    return new Response(JSON.stringify({ message: 'Major created', NewMajor }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500 });
  }
}