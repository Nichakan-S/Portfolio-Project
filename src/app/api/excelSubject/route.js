// src/pages/api/excelSubject.js
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const processUpload = upload.single('file');

    processUpload(req, res, async (error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        try {
            if (!req.file) {
                throw new Error('File is not found');
            }
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            const newSubjects = await prisma.subjects.createMany({
                data: jsonData.map(subject => ({
                    name: subject.name,
                    code: subject.code,
                    day: subject.day,
                    group: subject.group,
                    starttime: subject.starttime,
                    endtime: subject.endtime,
                    term: parseInt(subject.term, 10),
                    year: parseInt(subject.year, 10)
                })),
                skipDuplicates: true,
            });

            res.status(200).json({ message: 'Data imported successfully', data: newSubjects });
        } catch (error) {
            console.error('Error processing the uploaded file:', error);
            res.status(500).json({ error: 'Could not import data from Excel' });
        }
    });
}
