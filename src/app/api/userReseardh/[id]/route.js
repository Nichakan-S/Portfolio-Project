import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return new Response(JSON.stringify(await prisma.manageResearch.findMany({
            where: {
                userId: Number(params.id)
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        })), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }    
}