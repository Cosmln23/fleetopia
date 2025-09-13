import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.SUPABASE_JWT_SECRET) {
      console.error('SUPABASE_JWT_SECRET is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Create JWT token for Supabase Realtime with Clerk user ID
    const token = jwt.sign(
      {
        aud: 'authenticated',
        role: 'authenticated',
        uid: userId, // Map Clerk userId to Supabase uid claim
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.SUPABASE_JWT_SECRET,
      { algorithm: 'HS256' }
    )

    return NextResponse.json({ 
      success: true,
      token: token,
      expiresIn: 3600 // 1 hour
    })

  } catch (error) {
    console.error('JWT token generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate token' 
    }, { status: 500 })
  }
}