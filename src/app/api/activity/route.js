import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activitySheet = await prisma.activity.findMany({
      include: {
        activity: {
          select: {
            name: true,
            type: true,
            year: true
          }
        },
        user: {
          select: {
            prefix: true,
            username: true,
            lastname: true
          }
        }
      }
    });
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
    const { activityRole, activityId, userId, file, audit, approve } = await request.json();
    if (!activityRole || !activityId || !userId || !file || !audit || !approve) {
      throw new Error('All fields (activityRole, activityId,userId, file, audit, approve) are required');
    }
    const activitySheet = await prisma.activity.create({
      data: {
        activityRole,
        activityId,
        userId,
        file,
        audit,
        approve
      },
    });
    return new Response(JSON.stringify({ message: 'Activity created', activitySheet }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Activity could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
