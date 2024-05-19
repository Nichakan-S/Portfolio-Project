import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    return Response.json(await prisma.position.findUnique({
      where: {
        id: Number(params.id)
      }
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'position could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req, { params }) {
  try {
    const { name, audit, evaluation, approveResearch, approveActivity, overview } = await req.json()
    return Response.json(await prisma.position.update({
      where: { id: Number(params.id) },
      data: {
        name,
        audit,
        employee,
        evaluation,
        approveResearch,
        approveActivity,
        overview
      },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'position could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, { params }) {
  try {
    return Response.json(await prisma.position.delete({
      where: { id: Number(params.id) },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'position could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}