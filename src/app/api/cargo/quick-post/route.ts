import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-utils';
import { withErrorHandler } from '@/lib/error-handler';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

// Quick Post Schema - simplified version for fast posting
const QuickPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  cargoType: z.enum(['General', 'Fragile', 'Hazardous', 'Refrigerated']),
  weight: z.number().positive('Weight must be positive').max(50000, 'Weight too large'),
  
  // Pickup
  pickupCity: z.string().min(2, 'Pickup city required'),
  pickupCountry: z.string().min(2, 'Pickup country required'),
  pickupAddress: z.string().min(5, 'Pickup address required'),
  pickupDate: z.string().datetime('Invalid pickup date'),
  
  // Delivery  
  deliveryCity: z.string().min(2, 'Delivery city required'),
  deliveryCountry: z.string().min(2, 'Delivery country required'),
  deliveryAddress: z.string().min(5, 'Delivery address required'),
  deliveryDate: z.string().datetime('Invalid delivery date'),
  
  // Optional fields
  volume: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  isUrgent: z.boolean().default(false),
  description: z.string().max(500).optional(),
});

async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Rate limiting  
  const rateLimitResult = await checkRateLimit(request, 'cargo');
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const { userId } = await auth();
    
    if (!userId) {
      return errorResponse('Authentication required', 401);
    }

    logger.apiRequest('POST', '/api/cargo/quick-post', userId);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = QuickPostSchema.parse(body);

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return errorResponse('User not found. Please complete registration first.', 404);
    }

    // Create cargo entry
    const cargo = await prisma.cargo.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description,
        cargoType: validatedData.cargoType,
        weight: validatedData.weight,
        volume: validatedData.volume,
        
        // Pickup details
        pickupAddress: validatedData.pickupAddress,
        pickupCity: validatedData.pickupCity,
        pickupCountry: validatedData.pickupCountry,
        pickupDate: new Date(validatedData.pickupDate),
        
        // Delivery details
        deliveryAddress: validatedData.deliveryAddress,
        deliveryCity: validatedData.deliveryCity,
        deliveryCountry: validatedData.deliveryCountry,
        deliveryDate: new Date(validatedData.deliveryDate),
        
        // Pricing
        budgetMax: validatedData.budgetMax,
        
        // Status
        status: 'Active',
        isUrgent: validatedData.isUrgent,
        isPublic: true, // Quick posts are public by default
      },
      select: {
        id: true,
        title: true,
        pickupCity: true,
        deliveryCity: true,
        weight: true,
        cargoType: true,
        isUrgent: true,
        createdAt: true
      }
    });

    logger.userAction('cargo_quick_posted', userId, { 
      cargoId: cargo.id,
      route: `${validatedData.pickupCity} → ${validatedData.deliveryCity}`,
      weight: validatedData.weight
    });

    const duration = Date.now() - startTime;
    logger.apiResponse('POST', '/api/cargo/quick-post', 201, duration, userId);

    return successResponse(
      {
        cargo: {
          ...cargo,
          createdAt: cargo.createdAt.toISOString()
        },
        redirectUrl: `/marketplace?tab=my-cargo&highlight=${cargo.id}`
      },
      'Cargo posted successfully! Redirecting to marketplace...',
      201
    );

  } catch (error) {
    const duration = Date.now() - startTime;
    const { userId: errorUserId } = await auth();
    logger.apiError('POST', '/api/cargo/quick-post', error, errorUserId || undefined);
    
    if (error instanceof z.ZodError) {
      return validationErrorResponse(error);
    }
    
    throw error; // Re-throw for withErrorHandler
  }
}

const wrappedPOST = withErrorHandler(POST);
export { wrappedPOST as POST };