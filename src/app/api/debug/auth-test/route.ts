import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 AUTH DEBUG: Starting auth test')
    
    // Get all headers
    const headers = Object.fromEntries(request.headers.entries())
    console.log('🔐 AUTH DEBUG: Headers:', headers)
    
    // Try Clerk auth
    const authResult = await auth()
    console.log('🔐 AUTH DEBUG: Clerk auth result:', authResult)
    
    const { userId, sessionId } = authResult
    console.log('🔐 AUTH DEBUG: userId:', userId)
    console.log('🔐 AUTH DEBUG: sessionId:', sessionId)
    
    if (!userId) {
      console.log('🔐 AUTH DEBUG: No userId - returning 401')
      return NextResponse.json({ 
        error: 'Unauthorized',
        debug: {
          message: 'No userId from Clerk auth',
          authResult,
          hasAuthHeader: !!headers.authorization,
          authHeaderStart: headers.authorization?.substring(0, 20)
        }
      }, { status: 401 })
    }
    
    console.log('🔐 AUTH DEBUG: Auth successful!')
    return NextResponse.json({
      success: true,
      debug: {
        message: 'Auth successful!',
        userId,
        sessionId,
        authResult
      }
    })
    
  } catch (error) {
    console.log('🔐 AUTH DEBUG: Auth error:', error)
    return NextResponse.json({ 
      error: 'Auth failed', 
      debug: { 
        error: error instanceof Error ? error.message : String(error) 
      }
    }, { status: 500 })
  }
}