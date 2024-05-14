import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const manageActivities = await prisma.manageActivity.findMany({
            select: {
                createdAt: true,
                activity: {
                    select: {
                        year: true
                    }
                }
            }
        });

        const manageResearches = await prisma.manageResearch.findMany({
            select: {
                year: true,
                createdAt: true
            }
        });
        const combinedResults = [
            ...manageActivities.map(ma => ({
                year: ma.activity.year,
                createdAt: ma.createdAt
            })),
            ...manageResearches
        ];

        return new Response(JSON.stringify(combinedResults), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
