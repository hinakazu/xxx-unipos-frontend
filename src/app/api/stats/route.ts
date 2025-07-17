import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
    const userId = session.user.id

    // 今月の開始日を取得
    const now = new Date()
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // 今月の全投稿データを取得
    const thisMonthPosts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: thisMonthStart
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            department: true,
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            department: true,
          }
        },
        _count: {
          select: {
            likes: true,
          }
        }
      }
    })

    // 今月のポイント取引データを取得
    const thisMonthTransactions = await prisma.pointTransaction.findMany({
      where: {
        createdAt: {
          gte: thisMonthStart
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            department: true,
          }
        }
      }
    })

    // ユーザー別統計を計算
    const userStats = new Map()

    // 投稿ポイント（送信）
    thisMonthPosts.forEach(post => {
      if (!userStats.has(post.author.id)) {
        userStats.set(post.author.id, {
          id: post.author.id,
          name: post.author.name,
          department: post.author.department,
          sentPoints: 0,
          receivedPoints: 0,
          postCount: 0,
          reactions: 0
        })
      }
      const stats = userStats.get(post.author.id)
      stats.sentPoints += post.points
      stats.postCount += 1
    })

    // 受信ポイント
    thisMonthPosts.forEach(post => {
      if (!userStats.has(post.recipient.id)) {
        userStats.set(post.recipient.id, {
          id: post.recipient.id,
          name: post.recipient.name,
          department: post.recipient.department,
          sentPoints: 0,
          receivedPoints: 0,
          postCount: 0,
          reactions: 0
        })
      }
      const stats = userStats.get(post.recipient.id)
      stats.receivedPoints += post.points
      stats.reactions += post._count.likes
    })

    // グッドポイント（LIKE_RECEIVE）も受信ポイントに加算
    thisMonthTransactions.forEach(transaction => {
      if (transaction.type === 'LIKE_RECEIVE') {
        if (!userStats.has(transaction.user.id)) {
          userStats.set(transaction.user.id, {
            id: transaction.user.id,
            name: transaction.user.name,
            department: transaction.user.department,
            sentPoints: 0,
            receivedPoints: 0,
            postCount: 0,
            reactions: 0
          })
        }
        const stats = userStats.get(transaction.user.id)
        stats.receivedPoints += transaction.amount
      }
    })

    const allUserStats = Array.from(userStats.values())

    // ランキングを計算
    const receivedRanking = allUserStats
      .sort((a, b) => b.receivedPoints - a.receivedPoints)
      .map((user, index) => ({
        rank: index + 1,
        ...user
      }))

    const sentRanking = allUserStats
      .sort((a, b) => b.sentPoints - a.sentPoints)
      .map((user, index) => ({
        rank: index + 1,
        ...user
      }))

    const postRanking = allUserStats
      .sort((a, b) => b.postCount - a.postCount)
      .map((user, index) => ({
        rank: index + 1,
        ...user
      }))

    // 部署別統計を計算
    const departmentStats = new Map()

    allUserStats.forEach(user => {
      if (!user.department) return
      
      if (!departmentStats.has(user.department)) {
        departmentStats.set(user.department, {
          department: user.department,
          totalPoints: 0,
          memberCount: 0
        })
      }
      const stats = departmentStats.get(user.department)
      stats.totalPoints += user.receivedPoints
      stats.memberCount += 1
    })

    const departmentRanking = Array.from(departmentStats.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((dept, index) => ({
        rank: index + 1,
        ...dept
      }))

    // 現在のユーザーのランキングを取得
    const currentUserReceivedRank = receivedRanking.find(u => u.id === userId)?.rank || null
    const currentUserSentRank = sentRanking.find(u => u.id === userId)?.rank || null
    const currentUserPostRank = postRanking.find(u => u.id === userId)?.rank || null

    return NextResponse.json({
      userRanking: {
        receivedPoints: currentUserReceivedRank,
        sentPoints: currentUserSentRank,
        postCount: currentUserPostRank
      },
      departmentRanking: departmentRanking.slice(0, 10), // 上位10部署
      topUsers: {
        receivedPoints: receivedRanking.slice(0, 10),
        sentPoints: sentRanking.slice(0, 10),
        postCount: postRanking.slice(0, 10)
      }
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}