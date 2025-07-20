import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

// 投稿一覧取得
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        points: true,
        goodCount: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            department: true,
            image: true,
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            department: true,
            image: true,
          }
        },
        likes: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            likes: true,
          }
        }
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 新規投稿作成
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, points, recipientId } = body

    // バリデーション
    if (!content || !points || !recipientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (points <= 0 || ![50, 100, 200, 500].includes(points)) {
      return NextResponse.json(
        { error: 'Invalid points amount' },
        { status: 400 }
      )
    }

    // 送信者の情報を取得
    const sender = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!sender) {
      return NextResponse.json(
        { error: 'Sender not found' },
        { status: 404 }
      )
    }

    // ポイント残高チェック
    if (sender.pointsBalance < points) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      )
    }

    // 受信者の存在確認
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      )
    }

    // トランザクションで投稿作成とポイント移動を実行
    const result = await prisma.$transaction(async (tx) => {
      // 投稿を作成
      const post = await tx.post.create({
        data: {
          content,
          points,
          authorId: session.user.id,
          recipientId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              department: true,
              image: true,
            }
          },
          recipient: {
            select: {
              id: true,
              name: true,
              department: true,
              image: true,
            }
          }
        }
      })

      // 送信者のポイントを減らす
      await tx.user.update({
        where: { id: session.user.id },
        data: { pointsBalance: { decrement: points } }
      })

      // 受信者のポイントを増やす
      await tx.user.update({
        where: { id: recipientId },
        data: { pointsBalance: { increment: points } }
      })

      // ポイント移動履歴を記録（送信）
      await tx.pointTransaction.create({
        data: {
          userId: session.user.id,
          postId: post.id,
          amount: -points,
          type: 'POST_SEND',
        }
      })

      // ポイント移動履歴を記録（受信）
      await tx.pointTransaction.create({
        data: {
          userId: recipientId,
          postId: post.id,
          amount: points,
          type: 'POST_RECEIVE',
        }
      })

      // 通知を作成（エラーが発生しても投稿は完了させる）
      try {
        await createNotification(
          recipientId,
          session.user.id,
          'POST_RECEIVED',
          '新しい感謝が届きました！',
          `${sender.name || '誰かさん'}からあなたに${points}ポイントの感謝が送られました`,
          post.id
        )
      } catch (notificationError) {
        console.error('通知作成エラー:', notificationError)
      }

      return post
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}