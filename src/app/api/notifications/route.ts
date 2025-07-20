import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 通知一覧取得
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    const unreadOnly = searchParams.get('unread') === 'true'

    // 通知を取得
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: session.user.id,
        ...(unreadOnly ? { isRead: false } : {})
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            department: true
          }
        },
        post: {
          select: {
            id: true,
            content: true,
            points: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    // 未読通知の数を取得
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: session.user.id,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 通知を既読にする
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // すべての通知を既読にする
      await prisma.notification.updateMany({
        where: {
          recipientId: session.user.id,
          isRead: false
        },
        data: {
          isRead: true
        }
      })
    } else if (notificationId) {
      // 特定の通知を既読にする
      await prisma.notification.update({
        where: {
          id: notificationId,
          recipientId: session.user.id
        },
        data: {
          isRead: true
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

