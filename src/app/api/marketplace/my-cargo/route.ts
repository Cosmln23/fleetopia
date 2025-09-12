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
    const status = searchParams.get('status'); // Active, Assigned, Completed, Cancelled
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter conditions
    const whereClause: any = {
      userId: userId
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Execute query
    const [cargos, total] = await Promise.all([
      prisma.cargo.findMany({
        where: whereClause,
        include: {
          quotes: {
            include: {
              carrier: {
                select: {
                  id: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          deals: {
            include: {
              transporter: {
                select: {
                  id: true
                }
              }
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
      
      // Cargo details
      weight: cargo.weight,
      volume: cargo.volume,
      cargoType: cargo.cargoType,
      packaging: cargo.packaging,
      specialRequirements: cargo.specialRequirements,
      
      // Pricing
      estimatedValue: cargo.estimatedValue,
      budgetMin: cargo.budgetMin,
      budgetMax: cargo.budgetMax,
      
      // Status and metadata
      isUrgent: cargo.isUrgent,
      isPublic: cargo.isPublic,
      status: cargo.status,
      createdAt: cargo.createdAt,
      updatedAt: cargo.updatedAt,
      
      // Quotes info
      quotes: cargo.quotes.map(quote => ({
        id: quote.id,
        carrierId: quote.carrierId,
        totalPrice: quote.totalPrice,
        vehicleType: quote.vehicleType,
        status: quote.status,
        createdAt: quote.createdAt,
        validUntil: quote.validUntil,
        notes: quote.notes
      })),
      quotesCount: cargo.quotes.length,
      
      // Deal info
      activeDeal: cargo.deals.find(deal => deal.status === 'Active') ? {
        id: cargo.deals.find(deal => deal.status === 'Active')!.id,
        status: cargo.deals.find(deal => deal.status === 'Active')!.status,
        progress: cargo.deals.find(deal => deal.status === 'Active')!.progress,
        transporterId: cargo.deals.find(deal => deal.status === 'Active')!.transporterId,
        totalAmount: cargo.deals.find(deal => deal.status === 'Active')!.totalAmount
      } : null,
      
      // Statistics
      stats: {
        totalQuotes: cargo.quotes.length,
        pendingQuotes: cargo.quotes.filter(q => q.status === 'Pending').length,
        acceptedQuotes: cargo.quotes.filter(q => q.status === 'Accepted').length,
        rejectedQuotes: cargo.quotes.filter(q => q.status === 'Rejected').length,
        hasActiveDeal: cargo.deals.some(deal => deal.status === 'Active')
      }
    }));

    // Calculate summary stats
    const summaryStats = {
      total,
      byStatus: {
        Active: cargos.filter(c => c.status === 'Active').length,
        Assigned: cargos.filter(c => c.status === 'Assigned').length,
        Completed: cargos.filter(c => c.status === 'Completed').length,
        Cancelled: cargos.filter(c => c.status === 'Cancelled').length
      },
      totalQuotes: cargos.reduce((sum, c) => sum + c.quotes.length, 0),
      activeDeals: cargos.filter(c => c.deals.some(d => d.status === 'Active')).length
    };

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
          status
        },
        summary: summaryStats
      }
    }, { 
      status: 200,
      headers: rateLimitResult.headers 
    });

  } catch (error) {
    console.error('Error in /api/marketplace/my-cargo:', error);
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