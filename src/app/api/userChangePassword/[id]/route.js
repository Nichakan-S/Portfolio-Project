import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    try {
        const { password } = await req.json()
        const hashedPassword = bcrypt.hashSync(password, 10);
        return Response.json(await prisma.subjects.update({
            where: { id: Number(params.id) },
            data: { password: hashedPassword },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'subjects could not be update' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}