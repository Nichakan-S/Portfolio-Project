import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return Response.json(await prisma.activityHeader.findUnique({
            where: {
                id: Number(params.id)
            }
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activityHeader could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        const { type, name, start, end, year, file   } = await req.json()
        return Response.json(await prisma.activityHeader.update({
            where: { id: Number(params.id) },
            data: { type, name, start, end, year, file   },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activityHeader could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
        return Response.json(await prisma.activityHeader.delete({
            where: { id: Number(params.id) },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activityHeader could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}