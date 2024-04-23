import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return Response.json(await prisma.major.findUnique({
            where: {
                id: Number(params.id)
            },
            include: {
                faculty: true
            }
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Major could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        const { facultyId, majorName } = await req.json()
        return Response.json(await prisma.major.update({
            where: { id: Number(params.id) },
            data: { facultyId, majorName },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'major could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
      return Response.json(await prisma.major.delete({
        where: { id: Number(params.id) },
      }))
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'faculty could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }