import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activityHeaders = await prisma.activityHeader.findMany();
    return new Response(JSON.stringify(activityHeaders), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching activityHeader:', error);
    return new Response(JSON.stringify({ error: 'Error fetching activityHeader' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const { type, name, start, end, year, file } = await request.json();
    if (!type || !name || !start || !end || !year) {
      throw new Error('All fields (type, name, start, end, year) are required');
    }
    const newactivityHeader = await prisma.activityHeader.create({
      data: {
        type,
        name,
        start: new Date(start),
        end: new Date(end),
        year,
        file
      },
    });
    return new Response(JSON.stringify({ message: 'activityHeader created', newactivityHeader }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'activityHeader could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
