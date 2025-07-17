import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Vercel Cron JobsのAuthorization確認
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Starting weekly points reset...')

    // 全ユーザーを取得
    const users = await prisma.user.findMany()
    
    let processedUsers = 0

    // 各ユーザーのポイントをリセット
    for (const user of users) {
      await prisma.$transaction(async (tx) => {
        const remainingPoints = user.pointsBalance

        // 残ポイントがある場合はリセットトランザクションを記録
        if (remainingPoints > 0) {
          await tx.pointTransaction.create({
            data: {
              userId: user.id,
              amount: -remainingPoints,
              type: 'WEEKLY_RESET',
            },
          })
        }

        // 新規ポイント付与のトランザクションを記録
        await tx.pointTransaction.create({
          data: {
            userId: user.id,
            amount: 400,
            type: 'WEEKLY_ALLOCATION',
          },
        })

        // ユーザーのポイント残高を400に更新
        await tx.user.update({
          where: { id: user.id },
          data: { pointsBalance: 400 },
        })
      })

      processedUsers++
    }

    console.log(`Weekly points reset completed. Processed ${processedUsers} users.`)

    return NextResponse.json({
      success: true,
      message: `Points reset completed for ${processedUsers} users`,
      processedUsers,
    })
  } catch (error) {
    console.error('Error in weekly points reset:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}