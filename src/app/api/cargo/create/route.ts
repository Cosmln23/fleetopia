import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const createCargoSchema = z.object({
  // Basic info
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().optional(),

  // Pickup details
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  pickupCity: z.string().min(2, 'Pickup city is required'),
  pickupCountry: z.string().min(2, 'Pickup country is required'),
  pickupDate: z.string().refine((date) => {
    const pickupDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return pickupDate >= today;
  }, 'Pickup date cannot be in the past'),
  pickupTimeStart: z.string().optional(),
  pickupTimeEnd: z.string().optional(),

  // Delivery details
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  deliveryCity: z.string().min(2, 'Delivery city is required'),
  deliveryCountry: z.string().min(2, 'Delivery country is required'),
  deliveryDate: z.string().refine((date) => {
    const deliveryDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deliveryDate >= today;
  }, 'Delivery date cannot be in the past'),
  deliveryTimeStart: z.string().optional(),
  deliveryTimeEnd: z.string().optional(),

  // Cargo specifications
  weight: z.number().positive('Weight must be positive').optional(),
  volume: z.number().positive('Volume must be positive').optional(),
  cargoType: z.enum(['General', 'Fragile', 'Hazardous', 'Refrigerated'], {
    errorMap: () => ({ message: 'Invalid cargo type' })
  }),
  packaging: z.string().optional(),
  specialRequirements: z.string().optional(),

  // Pricing
  estimatedValue: z.number().positive('Estimated value must be positive').optional(),
  budgetMin: z.number().positive('Minimum budget must be positive').optional(),
  budgetMax: z.number().positive('Maximum budget must be positive').optional(),

  // Options
  isUrgent: z.boolean().default(false),
  isPublic: z.boolean().default(true)
}).refine((data) => {
  // Validate pickup date is before delivery date
  const pickup = new Date(data.pickupDate);
  const delivery = new Date(data.deliveryDate);
  return pickup <= delivery;
}, {
  message: 'Delivery date must be after pickup date',
  path: ['deliveryDate']
}).refine((data) => {
  // Validate budget range
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMin <= data.budgetMax;
  }
  return true;
}, {
  message: 'Maximum budget must be greater than minimum budget',
  path: ['budgetMax']
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - cargo type for posting
    const rateLimitResult = await checkRateLimit(request, 'cargo');
    if (!rateLimitResult.success) {
      return rateLimitResult.response;
    }

    // Authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate data against schema
    let validatedData;
    try {
      validatedData = createCargoSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          role: 'Trial', // Default role
          firstLogin: true
        }
      });
    }

    // Check user's cargo posting limits (Trial users might have limits)
    if (user.role === 'Trial') {
      const activeCargoCount = await prisma.cargo.count({
        where: {
          userId: userId,
          status: 'Active'
        }
      });

      // Trial limit: 5 active cargo posts
      if (activeCargoCount >= 5) {
        return NextResponse.json(
          {
            success: false,
            error: 'Trial users are limited to 5 active cargo posts. Please upgrade to Pro for unlimited posting.',
            code: 'TRIAL_LIMIT_EXCEEDED'
          },
          { status: 403 }
        );
      }
    }

    // Create cargo record
    const cargo = await prisma.cargo.create({
      data: {
        userId,
        title: validatedData.title,
        description: validatedData.description,
        
        // Pickup
        pickupAddress: validatedData.pickupAddress,
        pickupCity: validatedData.pickupCity,
        pickupCountry: validatedData.pickupCountry,
        pickupDate: new Date(validatedData.pickupDate),
        pickupTimeStart: validatedData.pickupTimeStart,
        pickupTimeEnd: validatedData.pickupTimeEnd,
        
        // Delivery
        deliveryAddress: validatedData.deliveryAddress,
        deliveryCity: validatedData.deliveryCity,
        deliveryCountry: validatedData.deliveryCountry,
        deliveryDate: new Date(validatedData.deliveryDate),
        deliveryTimeStart: validatedData.deliveryTimeStart,
        deliveryTimeEnd: validatedData.deliveryTimeEnd,
        
        // Cargo details
        weight: validatedData.weight,
        volume: validatedData.volume,
        cargoType: validatedData.cargoType,
        packaging: validatedData.packaging,
        specialRequirements: validatedData.specialRequirements,
        
        // Pricing
        estimatedValue: validatedData.estimatedValue,
        budgetMin: validatedData.budgetMin,
        budgetMax: validatedData.budgetMax,
        
        // Status
        status: 'Active',
        isUrgent: validatedData.isUrgent,
        isPublic: validatedData.isPublic
      },
      include: {
        user: {
          select: {
            id: true,
            role: true
          }
        }
      }
    });

    // Update user's firstLogin status if this is their first cargo
    if (user.firstLogin) {
      await prisma.user.update({
        where: { id: userId },
        data: { firstLogin: false }
      });
    }

    // Format response
    const formattedCargo = {
      id: cargo.id,
      title: cargo.title,
      description: cargo.description,
      
      pickup: {
        address: cargo.pickupAddress,
        city: cargo.pickupCity,
        country: cargo.pickupCountry,
        date: cargo.pickupDate,
        timeStart: cargo.pickupTimeStart,
        timeEnd: cargo.pickupTimeEnd
      },
      delivery: {
        address: cargo.deliveryAddress,
        city: cargo.deliveryCity,
        country: cargo.deliveryCountry,
        date: cargo.deliveryDate,
        timeStart: cargo.deliveryTimeStart,
        timeEnd: cargo.deliveryTimeEnd
      },
      
      specifications: {
        weight: cargo.weight,
        volume: cargo.volume,
        cargoType: cargo.cargoType,
        packaging: cargo.packaging,
        specialRequirements: cargo.specialRequirements
      },
      
      pricing: {
        estimatedValue: cargo.estimatedValue,
        budgetMin: cargo.budgetMin,
        budgetMax: cargo.budgetMax
      },
      
      status: {
        current: cargo.status,
        isUrgent: cargo.isUrgent,
        isPublic: cargo.isPublic
      },
      
      metadata: {
        createdAt: cargo.createdAt,
        updatedAt: cargo.updatedAt,
        owner: {
          id: cargo.user.id,
          role: cargo.user.role
        }
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Cargo created successfully',
      data: {
        cargo: formattedCargo
      }
    }, { 
      status: 201,
      headers: rateLimitResult.headers 
    });

  } catch (error) {
    console.error('Error in /api/cargo/create:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Duplicate cargo entry',
            code: 'DUPLICATE_ENTRY'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}