import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const activities = await prisma.activity.findMany({
            where: {
                userId: Number(params.id)
            },
            select: {
                id: true
            }
        });
        return new Response(JSON.stringify(activities), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }    
}
