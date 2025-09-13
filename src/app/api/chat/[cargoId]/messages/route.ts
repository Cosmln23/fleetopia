import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CreateMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  messageType: z.enum(['text', 'system']).default('text')
})

export async function GET(
  request: NextRequest,
  { params }: { params: { cargoId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cargoId = params.cargoId
    if (!cargoId) {
      return NextResponse.json({ error: 'Cargo ID is required' }, { status: 400 })
    }

    // Find or create chat thread for this cargo
    let chatThread = await prisma.chatThread.findFirst({
      where: {
        OR: [
          { dealId: cargoId },
          { quoteId: cargoId },
          // For direct cargo chats, we'll use a pattern in title
          { title: `cargo-${cargoId}` }
        ]
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    })

    // If no thread exists for this cargo, create one
    if (!chatThread) {
      // Get cargo info to determine participants
      const cargo = await prisma.cargo.findUnique({
        where: { id: cargoId },
        select: { userId: true }
      })

      if (!cargo) {
        return NextResponse.json({ error: 'Cargo not found' }, { status: 404 })
      }

      // Create new chat thread
      chatThread = await prisma.chatThread.create({
        data: {
          title: `cargo-${cargoId}`,
          participants: [cargo.userId, userId], // Cargo owner + current user
          isActive: true
        },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  role: true
                }
              }
            },
            orderBy: {
              createdAt: 'asc'
            }
          }
        }
      })
    }

    // Format messages for response
    const formattedMessages = chatThread.messages.map(message => ({
      id: message.id,
      content: message.content,
      messageType: message.messageType,
      senderId: message.senderId,
      senderRole: message.sender.role,
      isRead: message.isRead,
      createdAt: message.createdAt.toISOString(),
      updatedAt: message.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: {
        threadId: chatThread.id,
        cargoId: cargoId,
        participants: chatThread.participants,
        messages: formattedMessages,
        totalMessages: formattedMessages.length
      }
    })

  } catch (error) {
    console.error('GET messages error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { cargoId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cargoId = params.cargoId
    if (!cargoId) {
      return NextResponse.json({ error: 'Cargo ID is required' }, { status: 400 })
    }

    // Parse request body
    const body = await request.json()
    const validationResult = CreateMessageSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validationResult.error.format()
      }, { status: 400 })
    }

    const data = validationResult.data

    // Find or create chat thread for this cargo
    let chatThread = await prisma.chatThread.findFirst({
      where: {
        title: `cargo-${cargoId}`
      }
    })

    if (!chatThread) {
      // Get cargo info to determine participants
      const cargo = await prisma.cargo.findUnique({
        where: { id: cargoId },
        select: { userId: true }
      })

      if (!cargo) {
        return NextResponse.json({ error: 'Cargo not found' }, { status: 404 })
      }

      // Create new chat thread
      chatThread = await prisma.chatThread.create({
        data: {
          title: `cargo-${cargoId}`,
          participants: [cargo.userId, userId],
          isActive: true
        }
      })
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        threadId: chatThread.id,
        senderId: userId,
        content: data.content,
        messageType: data.messageType,
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            role: true
          }
        }
      }
    })

    // Update thread's lastMessageAt
    await prisma.chatThread.update({
      where: { id: chatThread.id },
      data: { lastMessageAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      data: {
        message: {
          id: message.id,
          content: message.content,
          messageType: message.messageType,
          senderId: message.senderId,
          senderRole: message.sender.role,
          isRead: message.isRead,
          createdAt: message.createdAt.toISOString()
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error('POST message error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}