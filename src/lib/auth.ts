import { db } from '../../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthUser {
  id: number;
  uuid: string;
  name: string;
  email: string;
  role: string;
  companyName: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      uuid: decoded.uuid,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      companyName: decoded.companyName,
    };
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !user.password) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  };
}

export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  companyName: string;
}): Promise<AuthUser> {
  const hashedPassword = await hashPassword(userData.password);
  
  const [user] = await db.insert(users).values({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    companyName: userData.companyName,
  }).returning();

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  };
}

export async function getUserById(id: number): Promise<AuthUser | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
  };
}

export async function verifyAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    
    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
} 