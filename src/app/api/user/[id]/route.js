import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    return Response.json(await prisma.user.findUnique({
      where: {
        id: Number(params.id)
      },
      include: {
        rank: true,
        faculty: true,
        major: true
      }
    }))
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req, { params }) {
  try {
    const { email, password, prefix, username, lastname, facultyId, majorId, rankId, user_image, role } = await req.json();
    const finalUserImage = user_image || null;
    const dataToUpdate = {
      email, 
      prefix, 
      username, 
      lastname, 
      facultyId, 
      majorId, 
      rankId, 
      user_image: finalUserImage,
      role
    };

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      dataToUpdate.password = hashedPassword;
    }

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