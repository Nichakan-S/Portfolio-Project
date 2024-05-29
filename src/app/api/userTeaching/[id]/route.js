import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const teaching = await prisma.teaching.findMany({
            where: {
                userId: Number(params.id)
            },
            include: {
                subjects: {
                    include: {
                        major: true
                    }
                }
            }
        });
        return new Response(JSON.stringify(teaching), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}