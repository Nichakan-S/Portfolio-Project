import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { approve } = await req.json();
        const updatedActivity = await prisma.activity.update({
            where: { id: Number(params.id) },
            data: { approve },
        });
        return new Response(JSON.stringify(updatedActivity), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Activity could not be updated' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
