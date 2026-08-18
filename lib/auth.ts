import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

const usersFile = path.join(process.cwd(), 'data', 'users.json');
const SESSION_COOKIE = 'learniee_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'learniee-demo-secret';

export async function getUsers(): Promise<User[]> {
  const file = await fs.readFile(usersFile, 'utf8');
  return JSON.parse(file);
}

export async function saveUsers(users: User[]) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function sign(value: string) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

export function createSession(email: string) {
  const value = Buffer.from(email).toString('base64url');
  return `${value}.${sign(value)}`;
}

export function verifySession(session: string | undefined) {
  if (!session) return null;

  const [value, signature] = session.split('.');
  if (!value || !signature) return null;

  const expected = sign(value);
  if (signature.length !== expected.length) return null;

  const valid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );

  if (!valid) return null;

  try {
    return Buffer.from(value, 'base64url').toString('utf8');
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const email = verifySession(cookieStore.get(SESSION_COOKIE)?.value);

  if (!email) return null;

  const users = await getUsers();
  return users.find((user) => user.email === email) ?? null;
}

export { SESSION_COOKIE };
