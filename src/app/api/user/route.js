import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import nextConnect from 'next-connect';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const upload = multer({
    storage: multer.diskStorage({
        destination: './public/uploads/',
        filename: (req, file, cb) => cb(null, file.originalname),
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only JPG and PNG is allowed!'), false);
        }
    }
});

const handler = nextConnect();

handler.use(upload.single('user_image'));

handler.post(async (req, res) => {
    const { email, password, prefix, username, lastname, facultyId, majorId, rankId, role } = req.body;
    const userImage = req.file ? req.file.path : '';

    try {
        const hashedPassword = await bcrypt.hash(password, 10);  // เข้ารหัสรหัสผ่าน

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,  // ใช้รหัสผ่านที่เข้ารหัสแล้ว
                prefix,
                username,
                lastname,
                facultyId: parseInt(facultyId),
                majorId: parseInt(majorId),
                rankId: parseInt(rankId),
                role,
                userImage
            }
        });
        res.status(200).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

export const config = {
    api: {
        bodyParser: false
    }
};

export default handler;
