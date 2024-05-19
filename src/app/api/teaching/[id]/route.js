import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return Response.json(await prisma.teaching.findUnique({
            where: {
                id: Number(params.id)
            }
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'teaching could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        const { subjectsId } = await req.json()
        return Response.json(await prisma.teaching.update({
            where: { id: Number(params.id) },
            data: { subjectsId },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'teaching could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
        return Response.json(await prisma.teaching.delete({
            where: { id: Number(params.id) },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'teaching could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}