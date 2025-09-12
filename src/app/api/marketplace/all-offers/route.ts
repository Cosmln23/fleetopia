import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'search');
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

    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const type = searchParams.get('type');
    const urgency = searchParams.get('urgency');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter conditions
    const whereClause: any = {
      status: 'Active',
      isPublic: true,
      // Exclude current user's cargo
      NOT: {
        userId: userId
      }
    };

    // Apply filters
    if (country && country !== 'all') {
      whereClause.OR = [
        { pickupCountry: { contains: country, mode: 'insensitive' } },
        { deliveryCountry: { contains: country, mode: 'insensitive' } }
      ];
    }

    if (type && type !== 'all') {
      whereClause.cargoType = type;
    }

    if (urgency === 'urgent') {
      whereClause.isUrgent = true;
    }

    if (priceMin || priceMax) {
      whereClause.budgetMin = {};
      if (priceMin) {
        whereClause.budgetMin.gte = parseFloat(priceMin);
      }
      if (priceMax) {
        whereClause.budgetMax = {};
        whereClause.budgetMax.lte = parseFloat(priceMax);
      }
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { pickupCity: { contains: search, mode: 'insensitive' } },
        { deliveryCity: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Execute query
    const [cargos, total] = await Promise.all([
      prisma.cargo.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              // Note: We don't have firstName/lastName in schema, using id for now
            }
          },
          quotes: {
            select: {
              id: true
            }
          },
          deals: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.cargo.count({
        where: whereClause
      })
    ]);

    // Format response
    const formattedCargos = cargos.map(cargo => ({
      id: cargo.id,
      title: cargo.title,
      description: cargo.description,
      
      // Route information
      pickup: {
        address: cargo.pickupAddress,
        city: cargo.pickupCity,
        country: cargo.pickupCountry,
        date: cargo.pickupDate
      },
      delivery: {
        address: cargo.deliveryAddress,
        city: cargo.deliveryCity,
        country: cargo.deliveryCountry,
        date: cargo.deliveryDate
      },
      
      // Cargo details
      weight: cargo.weight,
      volume: cargo.volume,
      cargoType: cargo.cargoType,
      packaging: cargo.packaging,
      
      // Pricing
      estimatedValue: cargo.estimatedValue,
      budgetMin: cargo.budgetMin,
      budgetMax: cargo.budgetMax,
      
      // Status and metadata
      isUrgent: cargo.isUrgent,
      status: cargo.status,
      createdAt: cargo.createdAt,
      
      // User info (minimal for privacy)
      poster: {
        id: cargo.user.id,
        // We'll add more user fields when available
      },
      
      // Stats
      quotesCount: cargo.quotes.length,
      hasActiveDeal: cargo.deals.some(deal => deal.status === 'Active'),
      
      // Distance calculation placeholder (implement later)
      estimatedDistance: null,
      estimatedDuration: null
    }));

    return NextResponse.json({
      success: true,
      data: {
        cargos: formattedCargos,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          country,
          type,
          urgency,
          priceMin,
          priceMax,
          search
        }
      }
    }, { 
      status: 200,
      headers: rateLimitResult.headers 
    });

  } catch (error) {
    console.error('Error in /api/marketplace/all-offers:', error);
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