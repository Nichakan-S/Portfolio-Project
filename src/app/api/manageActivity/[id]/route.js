import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return Response.json(await prisma.manageActivity.findUnique({
            where: {
                id: Number(params.id)
            }
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'manageActivity could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        const { activityId, file, status } = await req.json()
        return Response.json(await prisma.manageActivity.update({
            where: { id: Number(params.id) },
            data: { activityId, file, status },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'manageActivity could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
        return Response.json(await prisma.manageActivity.delete({
            where: { id: Number(params.id) },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'manageActivity could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}