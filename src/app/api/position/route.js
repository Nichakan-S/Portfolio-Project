import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { rankname, employee, evaluation, overview  } = await request.json();
    if (!rankname || typeof employee !== 'boolean' || typeof evaluation !== 'boolean' || typeof overview !== 'boolean') {
        throw new Error('All fields are required and employee, evaluation, overview must be boolean.');
      }   
    const NewRank = await prisma.rank.create({
      data: {
        rankname,
        employee,
        evaluation,
        overview
      },
    });
    return new Response(JSON.stringify({ message: 'Major created', NewRank }), {
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