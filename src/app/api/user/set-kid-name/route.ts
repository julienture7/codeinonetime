
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const setKidNameSchema = z.object({
  kidName: z.string().min(1, "Kid's name cannot be empty").max(50, "Kid's name is too long"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validation = setKidNameSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { kidName } = validation.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { kidName },
    });
    
    // The session update should ideally be handled by NextAuth by triggering an update.
    // For immediate effect, the client might need to re-fetch the session or the JWT callback will update it on next request.

    return NextResponse.json({ success: true, message: "Kid's name updated successfully", kidName });

  } catch (error) {
    console.error("Set kid's name error:", error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
