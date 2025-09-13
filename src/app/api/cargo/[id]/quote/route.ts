import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateQuoteSchema = z.object({
  totalPrice: z.number().positive('Price must be positive'),
  pricePerKm: z.number().positive().optional(),
  estimatedDistance: z.number().positive().optional(),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
  estimatedPickupTime: z.string().optional(),
  estimatedDeliveryTime: z.string().optional(),
  notes: z.string().optional(),
  validUntil: z.string().datetime().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cargoId = params.id
    if (!cargoId) {
      return NextResponse.json({ error: 'Cargo ID is required' }, { status: 400 })
    }

    // Check if cargo exists and user is the owner
    const cargo = await prisma.cargo.findUnique({
      where: { id: cargoId },
      select: {
        id: true,
        userId: true,
        title: true
      }
    })

    if (!cargo) {
      return NextResponse.json({ error: 'Cargo not found' }, { status: 404 })
    }

    if (cargo.userId !== userId) {
      return NextResponse.json({ 
        error: 'You can only view quotes for your own cargo' 
      }, { status: 403 })
    }

    // Get all quotes for this cargo
    const quotes = await prisma.quote.findMany({
      where: {
        cargoId: cargoId
      },
      include: {
        carrier: {
          select: {
            id: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedQuotes = quotes.map(quote => ({
      id: quote.id,
      cargoId: quote.cargoId,
      carrierId: quote.carrierId,
      totalPrice: quote.totalPrice,
      pricePerKm: quote.pricePerKm,
      estimatedDistance: quote.estimatedDistance,
      vehicleType: quote.vehicleType,
      estimatedPickupTime: quote.estimatedPickupTime,
      estimatedDeliveryTime: quote.estimatedDeliveryTime,
      notes: quote.notes,
      status: quote.status,
      validUntil: quote.validUntil?.toISOString(),
      createdAt: quote.createdAt.toISOString(),
      updatedAt: quote.updatedAt.toISOString(),
      carrier: quote.carrier
    }))

    return NextResponse.json({
      success: true,
      data: {
        cargoId: cargoId,
        cargoTitle: cargo.title,
        quotesCount: quotes.length,
        quotes: formattedQuotes
      }
    })
  } catch (error) {
    console.error('GET quote error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('📝 POST Quote: Starting...')
    
    const { userId } = await auth()
    if (!userId) {
      console.log('📝 POST Quote: No userId')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('📝 POST Quote: userId:', userId)

    const cargoId = params.id
    if (!cargoId) {
      console.log('📝 POST Quote: No cargoId')
      return NextResponse.json({ error: 'Cargo ID is required' }, { status: 400 })
    }

    console.log('📝 POST Quote: cargoId:', cargoId)

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('📝 POST Quote: body:', body)
    } catch (error) {
      console.log('📝 POST Quote: JSON parse error:', error)
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // Validate input
    const validationResult = CreateQuoteSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('📝 POST Quote: Validation failed:', validationResult.error.format())
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.error.format()
      }, { status: 400 })
    }

    const data = validationResult.data
    console.log('📝 POST Quote: Validation passed:', data)

    // Check if cargo exists
    const cargo = await prisma.cargo.findUnique({
      where: { id: cargoId },
      select: {
        id: true,
        userId: true,
        status: true,
        title: true
      }
    })

    if (!cargo) {
      console.log('📝 POST Quote: Cargo not found')
      return NextResponse.json({ error: 'Cargo not found' }, { status: 404 })
    }

    console.log('📝 POST Quote: Cargo found:', cargo)

    if (cargo.userId === userId) {
      console.log('📝 POST Quote: Cannot quote own cargo')
      return NextResponse.json({ 
        error: 'Cannot quote on your own cargo' 
      }, { status: 400 })
    }

    if (cargo.status !== 'Active') {
      console.log('📝 POST Quote: Cargo not active')
      return NextResponse.json({ 
        error: 'Cannot quote on inactive cargo' 
      }, { status: 400 })
    }

    // Check if user already has a quote for this cargo
    const existingQuote = await prisma.quote.findFirst({
      where: {
        cargoId: cargoId,
        carrierId: userId
      }
    })

    if (existingQuote) {
      console.log('📝 POST Quote: Quote already exists')
      return NextResponse.json({ 
        error: 'You already have a quote for this cargo' 
      }, { status: 400 })
    }

    // Create the quote
    console.log('📝 POST Quote: Creating quote...')
    const quote = await prisma.quote.create({
      data: {
        cargoId: cargoId,
        carrierId: userId,
        totalPrice: data.totalPrice,
        pricePerKm: data.pricePerKm,
        estimatedDistance: data.estimatedDistance,
        vehicleType: data.vehicleType,
        estimatedPickupTime: data.estimatedPickupTime,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        notes: data.notes,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
        status: 'Pending'
      },
      include: {
        carrier: {
          select: {
            id: true,
            role: true
          }
        },
        cargo: {
          select: {
            id: true,
            title: true,
            userId: true
          }
        }
      }
    })

    console.log('📝 POST Quote: Quote created:', quote.id)

    return NextResponse.json({
      success: true,
      data: {
        quote: {
          id: quote.id,
          cargoId: quote.cargoId,
          carrierId: quote.carrierId,
          totalPrice: quote.totalPrice,
          pricePerKm: quote.pricePerKm,
          estimatedDistance: quote.estimatedDistance,
          vehicleType: quote.vehicleType,
          estimatedPickupTime: quote.estimatedPickupTime,
          estimatedDeliveryTime: quote.estimatedDeliveryTime,
          notes: quote.notes,
          status: quote.status,
          validUntil: quote.validUntil?.toISOString(),
          createdAt: quote.createdAt.toISOString()
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('📝 POST Quote: Global error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      debug: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}