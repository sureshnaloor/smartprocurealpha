import { NextRequest, NextResponse } from 'next/server';
import { createUser, generateToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, companyName } = await request.json();

    if (!name || !email || !password || !role || !companyName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['buyer', 'vendor'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either "buyer" or "vendor"' },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      password,
      role,
      companyName,
    });

    const token = generateToken(user);

    return NextResponse.json({
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      token,
    });
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    if (error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 