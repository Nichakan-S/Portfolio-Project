import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    return new Response(JSON.stringify(await prisma.user.findUnique({
      where: {
        id: Number(params.id)
      },
      include: {
        position: true,
        major: {
          include: {
            faculty: true
          }
        }
      }
    })), { headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be retrieved' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


export async function PUT(req, { params }) {
  try {
    const { email, prefix, username, lastname, majorId, positionId, userImage, role } = await req.json();
    const finalUserImage = userImage || null;

    const dataToUpdate = {
      email,
      prefix,
      username,
      lastname,
      majorId,
      positionId,
      userImage: finalUserImage,
      role
    };
    return Response.json(await prisma.user.update({
      where: { id: Number(params.id) },
      data: dataToUpdate,
    }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be updated' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}


export async function DELETE(req, { params }) {
  try {
    return Response.json(await prisma.user.delete({
      where: { id: Number(params.id) },
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}