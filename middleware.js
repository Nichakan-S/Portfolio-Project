import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

export async function middleware(req) {
  const session = await getSession({ req });
  const path = req.nextUrl.pathname;

  if (path.startsWith('/admin/')) {
    if (!session || session.user.role !== 'admin') {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }
  }
  if (path.startsWith('/users/')) {
    if (!session || session.user.role !== 'user') {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }
  }
  return NextResponse.next();
}