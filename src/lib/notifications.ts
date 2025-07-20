import { prisma } from '@/lib/prisma'

// 通知を作成する関数（他のAPIから呼び出し用）
export async function createNotification(
  recipientId: string,
  senderId: string | null,
  type: string,
  title: string,
  message: string,
  postId?: string
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        recipientId,
        senderId,
        type,
        title,
        message,
        postId
      }
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}