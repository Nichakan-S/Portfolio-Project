import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            where: {
                audit: 'pass'
            },
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
                        username: true
                    }
                }
            }
        });
        return new Response(JSON.stringify(activities), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return new Response(JSON.stringify({ error: 'Activity could not be fetched', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
