import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all chat threads where user is participant
    const chatThreads = await prisma.chatThread.findMany({
      where: {
        participants: {
          array_contains: userId
        },
        isActive: true
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            content: true,
            createdAt: true,
            senderId: true
          }
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: {
                  not: userId // Unread messages from others
                }
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    })

    // Format response
    const formattedThreads = chatThreads.map(thread => ({
      id: thread.id,
      title: thread.title,
      participants: thread.participants,
      lastMessage: thread.messages[0] ? {
        content: thread.messages[0].content,
        createdAt: thread.messages[0].createdAt.toISOString(),
        senderId: thread.messages[0].senderId
      } : null,
      unreadCount: thread._count.messages,
      lastMessageAt: thread.lastMessageAt?.toISOString(),
      createdAt: thread.createdAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: {
        threads: formattedThreads,
        totalThreads: formattedThreads.length
      }
    })

  } catch (error) {
    console.error('GET threads error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}