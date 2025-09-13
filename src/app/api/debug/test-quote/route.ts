import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateQuoteSchema = z.object({
  totalPrice: z.number().positive('Price must be positive'),
  vehicleType: z.string().min(1, 'Vehicle type is required'),
})

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 DEBUG: Starting test quote endpoint')
    
    // DEBUG: Get a real user from database
    const firstUser = await prisma.user.findFirst({
      select: { id: true }
    })
    
    if (!firstUser) {
      return NextResponse.json({ 
        error: 'No users found in database for testing'
      }, { status: 400 })
    }
    
    const userId = firstUser.id
    console.log('🧪 DEBUG: Using real userId:', userId)

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('🧪 DEBUG: Request body:', body)
    } catch (error) {
      console.log('🧪 DEBUG: JSON parse error:', error)
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // Validate input
    const validationResult = CreateQuoteSchema.safeParse(body)
    if (!validationResult.success) {
      console.log('🧪 DEBUG: Validation failed:', validationResult.error.format())
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.error.format()
      }, { status: 400 })
    }

    console.log('🧪 DEBUG: Validation passed:', validationResult.data)

    // Check if we can connect to database
    try {
      const cargoCount = await prisma.cargo.count()
      console.log('🧪 DEBUG: Database connection OK, cargo count:', cargoCount)
      
      // Get first cargo for testing
      const firstCargo = await prisma.cargo.findFirst({
        select: { id: true, title: true, userId: true, status: true }
      })
      console.log('🧪 DEBUG: First cargo found:', firstCargo)
      
      if (!firstCargo) {
        return NextResponse.json({ 
          error: 'No cargo found in database for testing',
          debug: { cargoCount }
        }, { status: 400 })
      }

      // Create test quote
      const testQuote = await prisma.quote.create({
        data: {
          cargoId: firstCargo.id,
          carrierId: userId,
          totalPrice: validationResult.data.totalPrice,
          vehicleType: validationResult.data.vehicleType,
          status: 'Pending'
        }
      })

      console.log('🧪 DEBUG: Test quote created:', testQuote.id)

      return NextResponse.json({
        success: true,
        debug: {
          message: 'Test quote endpoint working!',
          userId,
          cargoCount,
          firstCargo,
          testQuote: {
            id: testQuote.id,
            cargoId: testQuote.cargoId,
            totalPrice: testQuote.totalPrice,
            status: testQuote.status
          }
        }
      }, { status: 201 })

    } catch (dbError) {
      console.log('🧪 DEBUG: Database error:', dbError)
      return NextResponse.json({ 
        error: 'Database connection failed', 
        debug: { 
          dbError: dbError instanceof Error ? dbError.message : String(dbError),
          stack: dbError instanceof Error ? dbError.stack : undefined
        }
      }, { status: 500 })
    }

  } catch (globalError) {
    console.log('🧪 DEBUG: Global error:', globalError)
    return NextResponse.json({ 
      error: 'Server error', 
      debug: { 
        globalError: globalError instanceof Error ? globalError.message : String(globalError) 
      }
    }, { status: 500 })
  }
}