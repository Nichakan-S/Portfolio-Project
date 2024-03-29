import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@auth/prisma-adapter';

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login with Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'kasem@chandra.ac.th' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        // ค้นหาในตาราง User ก่อน
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ถ้าไม่พบใน User, ค้นหาในตาราง Admin
        if (!user) {
          user = await prisma.admin.findUnique({
            where: { email: credentials.email },
          });
        }

        // ตรวจสอบรหัสผ่าน
        if (user && (await bcrypt.compare(credentials.password, user.password))) {
          // ส่งค่าที่ต้องการกลับไปยัง client
          return {
            id: user.id,
            email: user.email,
            role: user.role ? user.role : 'admin', // เพิ่มฟิลด์ role เพื่อแยกแยะบทบาทของผู้ใช้
          };
        } else {
          throw new Error('Invalid email or password');
        }
      },
      
    })
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role; // บันทึก role ไว้ใน token
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = { ...session.user, id: token.id, role: token.role }; // ส่ง role ไปยัง session
      return session;
    }
  },
  
}

const handler = NextAuth(authOptions);

//export { handler as default };

//export default handler;

export { handler as GET, handler as POST }
