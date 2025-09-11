import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { stripe } from '@/lib/stripe';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, firstName, lastName } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: email,
      name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
      metadata: {
        clerkUserId: userId
      }
    });

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: userId,
        stripeCustomerId: stripeCustomer.id,
        role: 'Trial',
        firstLogin: true
      }
    });

    return NextResponse.json({ user, stripeCustomer: { id: stripeCustomer.id } });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}