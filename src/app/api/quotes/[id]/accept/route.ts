import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandler } from '@/lib/error-handler'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(async () => {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quoteId = params.id
    if (!quoteId) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 })
    }

    // Get quote with cargo details
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        cargo: {
          select: {
            id: true,
            userId: true,
            status: true,
            title: true
          }
        },
        carrier: {
          select: {
            id: true,
            role: true
          }
        }
      }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Only cargo owner can accept quotes
    if (quote.cargo.userId !== userId) {
      return NextResponse.json({ 
        error: 'Only cargo owner can accept quotes' 
      }, { status: 403 })
    }

    // Check if quote is in pending status
    if (quote.status !== 'Pending') {
      return NextResponse.json({ 
        error: 'Quote is no longer pending' 
      }, { status: 400 })
    }

    // Check if cargo is still active
    if (quote.cargo.status !== 'Active') {
      return NextResponse.json({ 
        error: 'Cargo is no longer active' 
      }, { status: 400 })
    }

    // Check if there's already an accepted deal for this cargo
    const existingDeal = await prisma.deal.findFirst({
      where: {
        cargoId: quote.cargoId,
        status: {
          in: ['Active', 'InTransit', 'Delivered']
        }
      }
    })

    if (existingDeal) {
      return NextResponse.json({ 
        error: 'This cargo already has an active deal' 
      }, { status: 400 })
    }

    // Use transaction to update quote, create deal, and reject other quotes
    const result = await prisma.$transaction(async (tx) => {
      // Accept the quote
      const updatedQuote = await tx.quote.update({
        where: { id: quoteId },
        data: {
          status: 'Accepted',
          updatedAt: new Date()
        }
      })

      // Create the deal
      const deal = await tx.deal.create({
        data: {
          cargoId: quote.cargoId,
          quoteId: quoteId,
          shipperId: quote.cargo.userId,
          transporterId: quote.carrierId,
          totalAmount: quote.totalPrice,
          status: 'Active',
          progress: 0.0,
          timeline: [
            {
              status: 'Created',
              timestamp: new Date().toISOString(),
              description: 'Deal created from accepted quote'
            }
          ]
        }
      })

      // Reject all other pending quotes for this cargo
      await tx.quote.updateMany({
        where: {
          cargoId: quote.cargoId,
          id: { not: quoteId },
          status: 'Pending'
        },
        data: {
          status: 'Rejected',
          updatedAt: new Date()
        }
      })

      // Update cargo status to Assigned
      await tx.cargo.update({
        where: { id: quote.cargoId },
        data: {
          status: 'Assigned',
          updatedAt: new Date()
        }
      })

      return { updatedQuote, deal }
    })

    // TODO: Send notifications to carrier and other rejected bidders
    // TODO: Create chat thread for the deal

    return NextResponse.json({
      success: true,
      data: {
        quote: {
          id: result.updatedQuote.id,
          status: result.updatedQuote.status,
          updatedAt: result.updatedQuote.updatedAt.toISOString()
        },
        deal: {
          id: result.deal.id,
          cargoId: result.deal.cargoId,
          status: result.deal.status,
          totalAmount: result.deal.totalAmount,
          progress: result.deal.progress,
          createdAt: result.deal.createdAt.toISOString()
        }
      }
    })
  })
}