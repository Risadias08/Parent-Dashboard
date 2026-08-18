import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createSession, getUsers, hashPassword, saveUsers, SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
      return NextResponse.json({ message: 'An account with this email already exists.' }, { status: 409 });
    }

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword(password),
    };

    users.push(user);
    await saveUsers(users);

    const response = NextResponse.json({ message: 'Signup successful.' });
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
