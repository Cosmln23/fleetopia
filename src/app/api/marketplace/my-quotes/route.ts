import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { checkRateLimit } from '@/lib/rate-limit';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(request, 'api');
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
    const status = searchParams.get('status'); // Pending, Accepted, Rejected, Expired
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter conditions
    const whereClause: any = {
      carrierId: userId
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Execute query
    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where: whereClause,
        include: {
          cargo: {
            include: {
              user: {
                select: {
                  id: true
                }
              }
            }
          },
          deal: {
            select: {
              id: true,
              status: true,
              progress: true,
              totalAmount: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.quote.count({
        where: whereClause
      })
    ]);

    // Format response
    const formattedQuotes = quotes.map(quote => ({
      id: quote.id,
      
      // Quote details
      totalPrice: quote.totalPrice,
      pricePerKm: quote.pricePerKm,
      estimatedDistance: quote.estimatedDistance,
      vehicleType: quote.vehicleType,
      estimatedPickupTime: quote.estimatedPickupTime,
      estimatedDeliveryTime: quote.estimatedDeliveryTime,
      notes: quote.notes,
      
      // Quote status
      status: quote.status,
      validUntil: quote.validUntil,
      createdAt: quote.createdAt,
      updatedAt: quote.updatedAt,
      
      // Cargo information
      cargo: {
        id: quote.cargo.id,
        title: quote.cargo.title,
        description: quote.cargo.description,
        
        pickup: {
          address: quote.cargo.pickupAddress,
          city: quote.cargo.pickupCity,
          country: quote.cargo.pickupCountry,
          date: quote.cargo.pickupDate
        },
        delivery: {
          address: quote.cargo.deliveryAddress,
          city: quote.cargo.deliveryCity,
          country: quote.cargo.deliveryCountry,
          date: quote.cargo.deliveryDate
        },
        
        weight: quote.cargo.weight,
        volume: quote.cargo.volume,
        cargoType: quote.cargo.cargoType,
        isUrgent: quote.cargo.isUrgent,
        
        // Cargo owner info (minimal)
        owner: {
          id: quote.cargo.user.id
        },
        
        // Budget comparison
        budgetMin: quote.cargo.budgetMin,
        budgetMax: quote.cargo.budgetMax,
        estimatedValue: quote.cargo.estimatedValue
      },
      
      // Deal status if accepted
      deal: quote.deal ? {
        id: quote.deal.id,
        status: quote.deal.status,
        progress: quote.deal.progress,
        totalAmount: quote.deal.totalAmount,
        startedAt: quote.deal.createdAt
      } : null,
      
      // Quote analytics
      analytics: {
        daysActive: Math.floor((new Date().getTime() - new Date(quote.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        isExpired: quote.validUntil ? new Date() > new Date(quote.validUntil) : false,
        budgetMatch: quote.cargo.budgetMin && quote.cargo.budgetMax ? {
          withinBudget: quote.totalPrice >= quote.cargo.budgetMin && quote.totalPrice <= quote.cargo.budgetMax,
          percentageOfMax: quote.cargo.budgetMax ? (quote.totalPrice / quote.cargo.budgetMax * 100) : null
        } : null
      }
    }));

    // Calculate summary stats
    const summaryStats = {
      total,
      byStatus: {
        Pending: quotes.filter(q => q.status === 'Pending').length,
        Accepted: quotes.filter(q => q.status === 'Accepted').length,
        Rejected: quotes.filter(q => q.status === 'Rejected').length,
        Expired: quotes.filter(q => q.status === 'Expired').length
      },
      totalValue: quotes.reduce((sum, q) => sum + q.totalPrice, 0),
      acceptedValue: quotes
        .filter(q => q.status === 'Accepted')
        .reduce((sum, q) => sum + q.totalPrice, 0),
      activeDeals: quotes.filter(q => q.deal && q.deal.status === 'Active').length,
      averageQuoteValue: quotes.length > 0 ? 
        quotes.reduce((sum, q) => sum + q.totalPrice, 0) / quotes.length : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        quotes: formattedQuotes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          status
        },
        summary: summaryStats
      }
    }, { 
      status: 200,
      headers: rateLimitResult.headers 
    });

  } catch (error) {
    console.error('Error in /api/marketplace/my-quotes:', error);
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