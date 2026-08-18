import { NextResponse } from 'next/server';
import { createSession, getUsers, hashPassword, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();
    const user = users.find((item) => item.email === normalizedEmail);

    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Login successful.' });
    response.cookies.set(SESSION_COOKIE, createSession(user.email), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
