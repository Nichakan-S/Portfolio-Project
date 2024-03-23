import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function POST(request) {
  try {
    const { name, day, group, starttime, endtime, term, year } = await request.json();

    if (!name || !day || !group || !starttime || !endtime || !term || !year) {
      throw new Error('All subject fields are required');
    }
    const newSubject = await prisma.subjects.create({
      data: {
        name, 
        day,
        group, 
        starttime, 
        endtime, 
        term, 
        year
      },
    });
    return new Response(JSON.stringify({ message: 'Subject created', newSubject }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Subject could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
