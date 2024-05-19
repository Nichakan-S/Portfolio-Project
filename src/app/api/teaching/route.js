import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teaching = await prisma.teaching.findMany({
      include: {
        subjects: true,
        user: {
          select: {
            username: true
          }
        }
      }
    });
    return new Response(JSON.stringify(teaching), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching teaching:', error);
    return new Response(JSON.stringify({ error: 'Error fetching teaching' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
export async function POST(request) {
  try {
    const { starttime, endtime, day, group, term, year, audit, subjectsId, userId } = await request.json();
    if ( !starttime || !endtime || !day || !group || !term || !year || !audit || !subjectsId || !userId ) {
      throw new Error('All fields are required');
    }
    const teaching = await prisma.teaching.create({
      data: { starttime, endtime, day, group, term, year, audit, subjectsId, userId },
    });
    return new Response(JSON.stringify({ message: 'teaching created', teaching }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'teaching could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
