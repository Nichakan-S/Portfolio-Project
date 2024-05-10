import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
      const activitySheet = await prisma.manageActivity.findMany();
      return new Response(JSON.stringify(activitySheet), {
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
      const { activityId, userId, file, status } = await request.json();
      if (!activityId || !userId || !file || !status ) {
        throw new Error('All fields (activityId, userId, file, status) are required');
      }
      const activitySheet = await prisma.manageActivity.create({
        data: {
          activityId,
          userId,
          file,
          status
        },
      });
      return new Response(JSON.stringify({ message: 'Activity created', activitySheet }), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Activity could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }
  