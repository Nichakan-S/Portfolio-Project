import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        const activities = await prisma.activity.findMany({
            where: {
                user: {
                    majorId: Number(params.id)
                }
            },
            include: {
                activity: {
                    select: {
                        name: true,
                        type: true,
                        year: true 
                    }
                },
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });

        return new Response(JSON.stringify(activities), {
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
        return Response.json(await prisma.activity.update({
            where: { id: Number(params.id) },
            data: { audit },
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'activity could not be update' }), { audit: 500, headers: { 'Content-Type': 'application/json' } });
    }
}