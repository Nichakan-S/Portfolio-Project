import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany();
    return new Response(JSON.stringify(faculties), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return new Response(JSON.stringify({ error: 'Error fetching faculties' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const { facultyName } = await request.json();
    if (!facultyName) {
      return new Response(JSON.stringify({ error: 'Faculty name is required' }), { status: 400 });
    }
    const NewFaculty = await prisma.faculty.create({
      data: {
        facultyName,
      },
    });
    return new Response(JSON.stringify({ message: 'Faculty created', NewFaculty }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Faculty could not be created', message: error.message }), { status: 500 });
  }
}
