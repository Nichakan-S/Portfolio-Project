import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { email, password, prefix, user_image, username, lastname, rankId, facultyId, majorId, teaching, manageactivity, manageResearch} = await request.json();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        prefix,
        user_image,
        username,
        lastname,
        rankId,
        facultyId,
        majorId,
        teaching,
        manageactivity,
        manageResearch,
      },
    });
    return new Response(JSON.stringify({ message: 'User created', user }), { status: 201 });
  } catch (error) {
    console.error(error); // แสดง error ใน console สำหรับการตรวจสอบ
    return new Response(JSON.stringify({ error: 'User could not be created' }), { status: 500 });
  }
}
