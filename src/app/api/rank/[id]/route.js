import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    return Response.json(await prisma.rank.findUnique({
      where: {
        id: Number(params.id)
      }
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'rank could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req, { params }) {
  try {
    const { rankname, employee, evaluation, overview } = await req.json()
    return Response.json(await prisma.rank.update({
      where: { id: Number(params.id) },
      data: {
        rankname,
        employee,
        evaluation,
        overview
      },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'rank could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(req, { params }) {
  try {
    return Response.json(await prisma.rank.delete({
      where: { id: Number(params.id) },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'rank could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}