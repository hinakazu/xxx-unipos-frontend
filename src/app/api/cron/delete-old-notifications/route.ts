import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // CRON_SECRET認証チェック
    const cronSecret = process.env.CRON_SECRET
    const authHeader = request.headers.get('authorization')
    
    if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 30日前の日付を計算
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // 30日以上前の通知を削除
    const deletedNotifications = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    })

    console.log(`[CRON] 古い通知を削除しました: ${deletedNotifications.count}件`)

    return NextResponse.json({
      success: true,
      deletedCount: deletedNotifications.count,
      message: `${deletedNotifications.count}件の古い通知を削除しました`
    })
  } catch (error) {
    console.error('通知削除処理でエラーが発生:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}