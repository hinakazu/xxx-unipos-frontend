import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id

    // 投稿の存在確認
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        recipient: true,
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // ユーザーのポイント残高確認
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.pointsBalance < 1) {
      return NextResponse.json(
        { error: 'Insufficient points' },
        { status: 400 }
      )
    }

    // トランザクションでグッド追加とポイント移動を実行
    const result = await prisma.$transaction(async (tx) => {
      // グッドを作成
      const like = await tx.like.create({
        data: {
          postId,
          userId: session.user.id,
        }
      })

      // 送信者のポイントを減らす
      await tx.user.update({
        where: { id: session.user.id },
        data: { pointsBalance: { decrement: 1 } }
      })

      // 投稿の受信者のポイントを増やす
      await tx.user.update({
        where: { id: post.recipientId },
        data: { pointsBalance: { increment: 1 } }
      })

      // ポイント移動履歴を記録（送信）
      await tx.pointTransaction.create({
        data: {
          userId: session.user.id,
          postId,
          amount: -1,
          type: 'LIKE_SEND',
        }
      })

      // ポイント移動履歴を記録（受信）
      await tx.pointTransaction.create({
        data: {
          userId: post.recipientId,
          postId,
          amount: 1,
          type: 'LIKE_RECEIVE',
        }
      })

      return like
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}