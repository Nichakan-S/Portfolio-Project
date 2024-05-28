import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const researchs = await prisma.research.findMany({
            where: {
                user: {
                    majorId: Number(params.id)
                }
            },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(researchs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        return new Response(JSON.stringify({ error: 'Activity could not be fetched', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function PUT(req, { params }) {
    try {
        const { audit } = await req.json()
        return Response.json(await prisma.research.update({
            where: { id: Number(params.id) },
            data: { audit },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'research could not be update' }), { audit: 500, headers: { 'Content-Type': 'application/json' } });
    }
}