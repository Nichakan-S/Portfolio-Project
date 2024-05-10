import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activitys = await prisma.activity.findMany();
    return new Response(JSON.stringify(activitys), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return new Response(JSON.stringify({ error: 'Error fetching activity' }), {
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
    const newActivity = await prisma.activity.create({
      data: {
        type,
        name,
        start: new Date(start),
        end: new Date(end),
        year,
        file
      },
    });
    return new Response(JSON.stringify({ message: 'Activity created', newActivity }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Activity could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
