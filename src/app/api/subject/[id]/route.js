import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    return Response.json(await prisma.subjects.findUnique({
      where: {
        id: Number(params.id)
      }
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'subjects could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req, { params }) {
  try {
    const  { nameTH, nameEN, code, majorId } = await req.json()
    return Response.json(await prisma.subjects.update({
      where: { id: Number(params.id) },
      data:  { nameTH, nameEN, code, majorId },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'subjects could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, { params }) {
  try {
    return Response.json(await prisma.subjects.delete({
      where: { id: Number(params.id) },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'subjects could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}