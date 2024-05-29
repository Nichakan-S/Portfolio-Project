import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { approve } = await req.json();
        const updatedResearch = await prisma.research.update({
            where: { id: Number(params.id) },
            data: { approve },
        });
        return new Response(JSON.stringify(updatedResearch), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Research could not be updated' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
