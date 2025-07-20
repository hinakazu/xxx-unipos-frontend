import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

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
        author: true,
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

    // 山分けロジック: 投稿作成者と感謝を伝えられた人で分配
    const recipients = [post.authorId, post.recipientId]
    const uniqueRecipients = Array.from(new Set(recipients)) // 重複を除去（作成者=受信者の場合）
    const pointPerRecipient = 1 / uniqueRecipients.length

    // トランザクションでグッド追加とポイント移動を実行
    const result = await prisma.$transaction(async (tx) => {
      // グッドを作成
      const like = await tx.like.create({
        data: {
          postId,
          userId: session.user.id,
        }
      })

      // 投稿のgoodCountを増やす
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: { goodCount: { increment: 1 } }
      })

      // 送信者のポイントを減らす
      await tx.user.update({
        where: { id: session.user.id },
        data: { pointsBalance: { decrement: 1 } }
      })

      // 各受信者にポイントを分配
      for (const recipientId of uniqueRecipients) {
        await tx.user.update({
          where: { id: recipientId },
          data: { pointsBalance: { increment: pointPerRecipient } }
        })

        // ポイント移動履歴を記録（受信）
        await tx.pointTransaction.create({
          data: {
            userId: recipientId,
            postId,
            amount: pointPerRecipient,
            type: 'LIKE_RECEIVE',
          }
        })
      }

      // ポイント移動履歴を記録（送信）
      await tx.pointTransaction.create({
        data: {
          userId: session.user.id,
          postId,
          amount: -1,
          type: 'LIKE_SEND',
        }
      })

      return { like, goodCount: updatedPost.goodCount }
    })

    // 投稿作成者と受信者に通知を送信
    try {
      const userResponse = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true }
      })

      for (const recipientId of uniqueRecipients) {
        if (recipientId !== session.user.id) { // 自分以外に通知
          await createNotification(
            recipientId,
            session.user.id,
            'LIKE_RECEIVED',
            'グッドが送られました！',
            `${userResponse?.name || '誰かさん'}があなたの投稿にグッドを送りました`,
            postId
          )
        }
      }
    } catch (notificationError) {
      console.error('通知作成エラー:', notificationError)
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}