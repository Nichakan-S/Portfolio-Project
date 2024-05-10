import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    try {
        return Response.json(await prisma.manageResearch.findUnique({
            where: {
                id: Number(params.id)
            }
        }))
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'manageResearch could not be created' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function PUT(req, { params }) {
    try {
        const { nameTH, nameEN, researchfund, type, year, file, status } = await req.json();

        if (!nameTH || !nameEN || !researchfund || !type || !year || !status) {
            return new Response(JSON.stringify({
                error: 'All required fields must be provided except userId'
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const updatedManageResearch = await prisma.manageResearch.update({
            where: { id: Number(params.id) },
            data: {
                nameTH,
                nameEN,
                researchfund,
                type,
                year,
                file,
                status
            },
        });

        return new Response(JSON.stringify({
            message: 'Research management entry updated successfully',
            updatedManageResearch
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error updating manage research entry:', error);
        return new Response(JSON.stringify({
            error: 'Failed to update research management entry',
            message: error.message
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function DELETE(req, { params }) {
    try {
      return Response.json(await prisma.manageResearch.delete({
        where: { id: Number(params.id) },
      }))
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Research could not be delete' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }