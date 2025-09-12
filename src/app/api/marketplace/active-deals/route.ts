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
    const status = searchParams.get('status'); // Active, InTransit, Delivered, Completed, Cancelled
    const role = searchParams.get('role'); // shipper, transporter, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build filter conditions - user can be either shipper OR transporter
    let whereClause: any = {
      OR: [
        { shipperId: userId },
        { transporterId: userId }
      ]
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Filter by role if specified
    if (role === 'shipper') {
      whereClause = { shipperId: userId };
      if (status && status !== 'all') {
        whereClause.status = status;
      }
    } else if (role === 'transporter') {
      whereClause = { transporterId: userId };
      if (status && status !== 'all') {
        whereClause.status = status;
      }
    }

    // Execute query
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where: whereClause,
        include: {
          cargo: {
            select: {
              id: true,
              title: true,
              description: true,
              pickupAddress: true,
              pickupCity: true,
              pickupCountry: true,
              pickupDate: true,
              pickupTimeStart: true,
              pickupTimeEnd: true,
              deliveryAddress: true,
              deliveryCity: true,
              deliveryCountry: true,
              deliveryDate: true,
              deliveryTimeStart: true,
              deliveryTimeEnd: true,
              weight: true,
              volume: true,
              cargoType: true,
              isUrgent: true,
              specialRequirements: true,
              createdAt: true
            }
          },
          quote: {
            select: {
              id: true,
              totalPrice: true,
              vehicleType: true,
              estimatedDistance: true,
              estimatedPickupTime: true,
              estimatedDeliveryTime: true,
              notes: true,
              createdAt: true
            }
          },
          shipper: {
            select: {
              id: true
            }
          },
          transporter: {
            select: {
              id: true
            }
          },
          chatThreads: {
            select: {
              id: true,
              lastMessageAt: true,
              isActive: true
            },
            take: 1,
            orderBy: {
              lastMessageAt: 'desc'
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.deal.count({
        where: whereClause
      })
    ]);

    // Format response
    const formattedDeals = deals.map(deal => {
      const userRole = deal.shipperId === userId ? 'shipper' : 'transporter';
      const otherParty = userRole === 'shipper' ? deal.transporter : deal.shipper;

      return {
        id: deal.id,
        
        // Deal details
        totalAmount: deal.totalAmount,
        status: deal.status,
        progress: deal.progress,
        
        // Timeline
        timeline: deal.timeline,
        agreedPickupDate: deal.agreedPickupDate,
        agreedDeliveryDate: deal.agreedDeliveryDate,
        actualPickupDate: deal.actualPickupDate,
        actualDeliveryDate: deal.actualDeliveryDate,
        
        // Timestamps
        createdAt: deal.createdAt,
        completedAt: deal.completedAt,
        updatedAt: deal.updatedAt,
        
        // User role in this deal
        userRole,
        
        // Other party info (minimal)
        otherParty: {
          id: otherParty.id,
          role: userRole === 'shipper' ? 'transporter' : 'shipper'
        },
        
        // Cargo details
        cargo: {
          id: deal.cargo.id,
          title: deal.cargo.title,
          description: deal.cargo.description,
          
          pickup: {
            address: deal.cargo.pickupAddress,
            city: deal.cargo.pickupCity,
            country: deal.cargo.pickupCountry,
            date: deal.cargo.pickupDate,
            timeStart: deal.cargo.pickupTimeStart,
            timeEnd: deal.cargo.pickupTimeEnd
          },
          delivery: {
            address: deal.cargo.deliveryAddress,
            city: deal.cargo.deliveryCity,
            country: deal.cargo.deliveryCountry,
            date: deal.cargo.deliveryDate,
            timeStart: deal.cargo.deliveryTimeStart,
            timeEnd: deal.cargo.deliveryTimeEnd
          },
          
          weight: deal.cargo.weight,
          volume: deal.cargo.volume,
          cargoType: deal.cargo.cargoType,
          isUrgent: deal.cargo.isUrgent,
          specialRequirements: deal.cargo.specialRequirements,
          
          postedAt: deal.cargo.createdAt
        },
        
        // Original quote details
        originalQuote: {
          id: deal.quote.id,
          totalPrice: deal.quote.totalPrice,
          vehicleType: deal.quote.vehicleType,
          estimatedDistance: deal.quote.estimatedDistance,
          estimatedPickupTime: deal.quote.estimatedPickupTime,
          estimatedDeliveryTime: deal.quote.estimatedDeliveryTime,
          notes: deal.quote.notes,
          quotedAt: deal.quote.createdAt
        },
        
        // Communication
        communication: {
          hasActiveChat: deal.chatThreads.length > 0 && deal.chatThreads[0].isActive,
          lastChatActivity: deal.chatThreads.length > 0 ? deal.chatThreads[0].lastMessageAt : null,
          chatThreadId: deal.chatThreads.length > 0 ? deal.chatThreads[0].id : null
        },
        
        // Deal analytics
        analytics: {
          daysActive: Math.floor((new Date().getTime() - new Date(deal.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
          isOverdue: deal.agreedDeliveryDate ? new Date() > new Date(deal.agreedDeliveryDate) && deal.status !== 'Completed' : false,
          progressPercentage: deal.progress,
          estimatedCompletionDays: deal.agreedDeliveryDate ? 
            Math.ceil((new Date(deal.agreedDeliveryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
        }
      };
    });

    // Calculate summary stats
    const summaryStats = {
      total,
      byStatus: {
        Active: deals.filter(d => d.status === 'Active').length,
        InTransit: deals.filter(d => d.status === 'InTransit').length,
        Delivered: deals.filter(d => d.status === 'Delivered').length,
        Completed: deals.filter(d => d.status === 'Completed').length,
        Cancelled: deals.filter(d => d.status === 'Cancelled').length
      },
      byRole: {
        asShipper: deals.filter(d => d.shipperId === userId).length,
        asTransporter: deals.filter(d => d.transporterId === userId).length
      },
      totalValue: deals.reduce((sum, d) => sum + d.totalAmount, 0),
      averageProgress: deals.length > 0 ? 
        deals.reduce((sum, d) => sum + d.progress, 0) / deals.length : 0,
      overdueDeals: deals.filter(d => 
        d.agreedDeliveryDate && 
        new Date() > new Date(d.agreedDeliveryDate) && 
        d.status !== 'Completed'
      ).length
    };

    return NextResponse.json({
      success: true,
      data: {
        deals: formattedDeals,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        },
        filters: {
          status,
          role
        },
        summary: summaryStats
      }
    }, { 
      status: 200,
      headers: rateLimitResult.headers 
    });

  } catch (error) {
    console.error('Error in /api/marketplace/active-deals:', error);
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