import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Not authenticated.' }, { status: 401 });
    return NextResponse.json({ user: { name: user.name, email: user.email } });
  } catch {
    return NextResponse.json({ message: 'Unable to load your account.' }, { status: 500 });
  }
}
