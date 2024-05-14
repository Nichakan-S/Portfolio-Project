import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { status } = await req.json()
        return Response.json(await prisma.manageActivity.update({
            where: { id: Number(params.id) },
            data: { status },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'manageActivity could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}