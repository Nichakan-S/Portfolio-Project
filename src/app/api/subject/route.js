import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const subjects = await prisma.subjects.findMany();
    return new Response(JSON.stringify(subjects), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return new Response(JSON.stringify({ error: 'Error fetching subjects' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const { nameTH, nameEN, code, majorId } = await request.json();

    if (!nameTH || !nameEN || !code || !majorId) {
      throw new Error('All subject fields are required');
    }
    const newSubject = await prisma.subjects.create({
      data: {
        nameTH, 
        nameEN, 
        code, 
        majorId 
      },
    });
    return new Response(JSON.stringify({ message: 'Subject created', newSubject }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Subject could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
