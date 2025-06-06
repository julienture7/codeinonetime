
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const checkUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = checkUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { email } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    return NextResponse.json({ exists: !!existingUser });

  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
