import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const positions = await prisma.position.findMany();
    return new Response(JSON.stringify(positions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return new Response(JSON.stringify({ error: 'Error fetching positions' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function POST(request) {
  try {
    const { name, audit, evaluation, approveResearch, approveActivity, overview } = await request.json();
    if (!name || typeof audit !== 'boolean' || typeof employee !== 'boolean' || typeof evaluation !== 'boolean' || typeof approveResearch !== 'boolean'|| typeof approveActivity !== 'boolean' || typeof overview !== 'boolean') {
      throw new Error('All fields are required');
    }
    const Newposition = await prisma.position.create({
      data: {
        name,
        audit,
        employee,
        evaluation,
        approveResearch,
        approveActivity,
        overview
      },
    });
    return new Response(JSON.stringify({ message: 'Major created', Newposition }), {
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