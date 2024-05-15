import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const subjects = await request.json();

    if (!Array.isArray(subjects) || subjects.length === 0) {
      throw new Error('Invalid input: Expected an array of subjects');
    }

    const createdSubjects = [];

    for (const subject of subjects) {
      const { name, code, day, group, starttime, endtime, term, year } = subject;

      if (!name || !code || !day || !group || !starttime || !endtime || !term || !year) {
        throw new Error('All subject fields are required');
      }

      const newSubject = await prisma.subjects.create({
        data: {
          name,
          day,
          group,
          starttime,
          endtime,
          term,
          year,
          code,
        },
      });

      createdSubjects.push(newSubject);
    }

    return new Response(JSON.stringify({ message: 'Subjects created', createdSubjects }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Subjects could not be created' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
