import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const research = await prisma.manageResearch.findMany({
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            }
        });
        return new Response(JSON.stringify(research), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching faculties:', error);
        return new Response(JSON.stringify({ error: 'Error fetching faculties' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function POST(request) {
    try {
        const { userId, nameTH, nameEN, Researchfund, type, year, file, status } = await request.json();

        if (!userId || !nameTH || !nameEN || !Researchfund || !type || !year || !status) {
            return new Response(JSON.stringify({
                error: 'All required fields must be provided'
            }), { status: 400 });
        }
        const newManageResearch = await prisma.manageResearch.create({
            data: {
                userId,
                nameTH,
                nameEN,
                Researchfund,
                type,
                year,
                file,
                status
            },
        });
        return new Response(JSON.stringify({
            message: 'Research management entry created successfully',
            newManageResearch
        }), { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            error: 'Failed to create research management entry',
            message: error.message
        }), { status: 500 });
    }
}
