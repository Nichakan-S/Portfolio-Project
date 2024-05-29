import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const activitySheet = await prisma.activity.findMany({
            where: {
                audit: 'pass',
                approve: 'pass'
            },
            select: {
                id: true,
                activity: {
                    select: {
                        id: true,
                        name: true,
                        year: true
                    }
                },
                user: {
                    select: {
                        major: {
                            select: {
                                majorName: true,
                            }
                        },
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