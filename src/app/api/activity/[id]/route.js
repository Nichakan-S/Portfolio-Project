import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return Response.json(await prisma.activity.findUnique({
            where: {
                id: Number(params.id)
            }
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activity could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        const { activityRole, activityId, file, audit, approve } = await req.json()
        return Response.json(await prisma.activity.update({
            where: { id: Number(params.id) },
            data: { activityRole, activityId, file, audit, approve },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activity could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
        return Response.json(await prisma.activity.delete({
            where: { id: Number(params.id) },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activity could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}