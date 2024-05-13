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
      const { subjectsId, userId } = await request.json();
      if (!subjectsId || !userId) {
        throw new Error('All fields (subjectsId, userId) are required');
      }
      const teaching = await prisma.teaching.create({
        data: {
          subjectsId,
          userId
        },
      });
      return new Response(JSON.stringify({ message: 'teaching created', teaching }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'teaching could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
  