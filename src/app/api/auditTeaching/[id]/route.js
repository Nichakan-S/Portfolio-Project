import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const teachings = await prisma.teaching.findMany({
            where: {
                user: {
                    majorId: Number(params.id)
                }
            },
            include: {
                subjects: true,
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(teachings), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return new Response(JSON.stringify({ error: 'teaching could not be fetched', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function PUT(req, { params }) {
    try {
        const { audit } = await req.json()
        return Response.json(await prisma.teaching.update({
            where: { id: Number(params.id) },
            data: { audit },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'teaching could not be update' }), { audit: 500, headers: { 'Content-Type': 'application/json' } });
    }
}