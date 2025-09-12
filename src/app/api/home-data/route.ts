import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { withErrorHandler } from '@/lib/error-handler';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const prisma = new PrismaClient();

interface HomeData {
  stats: {
    totalActiveCargo: number;
    totalActiveDeals: number;
    totalUsers: number;
  };
  userStats?: {
    myCargo: number;
    myQuotes: number;
    myActiveDeals: number;
    myCompletedDeals: number;
  };
  recentActivity: {
    recentCargo: Array<{
      id: string;
      title: string;
      pickupCity: string;
      deliveryCity: string;
      weight: number | null;
      createdAt: string;
    }>;
    topRoutes: Array<{
      route: string;
      count: number;
    }>;
  };
}

async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Rate limiting
  const rateLimitResult = await checkRateLimit(request, 'api');
  if (!rateLimitResult.success && rateLimitResult.response) {
    return rateLimitResult.response;
  }

  try {
    const { userId } = await auth();
    
    logger.apiRequest('GET', '/api/home-data', userId || undefined);

    // Get global stats
    const [totalActiveCargo, totalActiveDeals, totalUsers] = await Promise.all([
      prisma.cargo.count({
        where: { status: 'Active' }
      }),
      prisma.deal.count({
        where: { status: { in: ['Active', 'InTransit'] } }
      }),
      prisma.user.count()
    ]);

    // Get user-specific stats if authenticated
    let userStats = undefined;
    if (userId) {
      const [myCargo, myQuotes, myActiveDeals, myCompletedDeals] = await Promise.all([
        prisma.cargo.count({
          where: { userId, status: { in: ['Active'] } }
        }),
        prisma.quote.count({
          where: { carrierId: userId, status: 'Pending' }
        }),
        prisma.deal.count({
          where: {
            OR: [
              { shipperId: userId },
              { transporterId: userId }
            ],
            status: { in: ['Active', 'InTransit'] }
          }
        }),
        prisma.deal.count({
          where: {
            OR: [
              { shipperId: userId },
              { transporterId: userId }
            ],
            status: 'Completed'
          }
        })
      ]);

      userStats = {
        myCargo,
        myQuotes,
        myActiveDeals,
        myCompletedDeals
      };
    }

    // Get recent cargo (last 5, public only)
    const recentCargo = await prisma.cargo.findMany({
      where: { 
        status: 'Active',
        isPublic: true
      },
      select: {
        id: true,
        title: true,
        pickupCity: true,
        deliveryCity: true,
        weight: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get top routes (simplified - just pickup->delivery city pairs)
    const topRoutesRaw = await prisma.cargo.groupBy({
      by: ['pickupCity', 'deliveryCity'],
      where: { 
        status: 'Active',
        isPublic: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const topRoutes = topRoutesRaw.map(route => ({
      route: `${route.pickupCity} → ${route.deliveryCity}`,
      count: route._count.id
    }));

    const homeData: HomeData = {
      stats: {
        totalActiveCargo,
        totalActiveDeals,
        totalUsers
      },
      userStats,
      recentActivity: {
        recentCargo: recentCargo.map(cargo => ({
          ...cargo,
          createdAt: cargo.createdAt.toISOString()
        })),
        topRoutes
      }
    };

    const duration = Date.now() - startTime;
    logger.apiResponse('GET', '/api/home-data', 200, duration, userId || undefined);

    return successResponse(homeData, 'Home data retrieved successfully');

  } catch (error) {
    const duration = Date.now() - startTime;
    const { userId: errorUserId } = await auth();
    logger.apiError('GET', '/api/home-data', error, errorUserId || undefined);
    throw error; // Re-throw for withErrorHandler
  }
}

const wrappedGET = withErrorHandler(GET);
export { wrappedGET as GET };