import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { approve } = await req.json()
        return Response.json(await prisma.activity.update({
            where: { id: Number(params.id) },
            data: { approve },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activity could not be update' }), { approve: 500, headers: { 'Content-Type': 'application/json' } });
    }
}