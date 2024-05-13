import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const activities = await prisma.manageActivity.findMany({
            where: {
                userId: Number(params.id)
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
        return new Response(JSON.stringify(activities), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }    
}
