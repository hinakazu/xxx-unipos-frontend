# NEXXDAO Frontend - Vercel デプロイ計画書

## 📋 プロジェクト概要

**アプリケーション名**: NEXXDAO Frontend  
**技術スタック**: Next.js 14 (App Router) + PostgreSQL + Prisma + NextAuth.js  
**デプロイ先**: Vercel  
**目的**: 感謝を伝え合うポイント制アプリケーションの本番環境構築

---

## 🏗️ 現在のアーキテクチャ

### フロントエンド
- **フレームワーク**: Next.js 14 (App Router)
- **UI/UX**: TailwindCSS + HeroUI + Framer Motion
- **認証**: NextAuth.js (Google OAuth)
- **状態管理**: React Hooks + Context API

### バックエンド
- **API**: Next.js API Routes
- **データベース**: PostgreSQL (開発環境: Docker Compose)
- **ORM**: Prisma
- **認証**: NextAuth.js

### 主要機能
- ✅ ユーザー認証 (Google OAuth)
- ✅ 投稿作成・表示
- ✅ グッドボタン機能（山分けポイント）
- ✅ 通知システム
- ✅ ランキング機能
- ✅ 統計ダッシュボード

---

## 🎯 デプロイ戦略

### 1. データベース選択: **Vercel Postgres**

**選択理由**:
- シームレスな統合とワンクリック設定
- 自動的な環境変数設定
- Vercelインフラとの最適化された接続
- 無料利用枠での開始が可能

**制限事項**:
- ベンダーロックインのリスク
- 大規模スケール時のコスト増加

---

## 🔧 デプロイ前の準備

### 1. package.json の修正

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
```

### 2. next.config.js の最適化

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Vercel最適化
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Google OAuth用
  },
};

module.exports = nextConfig;
```

### 3. vercel.json の設定

```json
{
  "crons": [
    {
      "path": "/api/cron/reset-points",
      "schedule": "0 0 * * 1"
    }
  ],
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  }
}
```

---

## 🌐 環境変数設定

### Vercelプロジェクトで設定が必要な環境変数

| 変数名 | 説明 | 取得方法 |
|--------|------|----------|
| `DATABASE_URL` | PostgreSQL接続文字列 | Vercel Postgres作成時に自動設定 |
| `NEXTAUTH_URL` | アプリケーションの本番URL | `https://your-domain.vercel.app` |
| `NEXTAUTH_SECRET` | NextAuth.js署名用秘密鍵 | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth クライアントID | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google OAuth クライアントシークレット | Google Cloud Console |

### 環境変数生成コマンド

```bash
# NextAuth Secret生成
openssl rand -base64 32

# 環境変数確認
npx @vercel/ncc build && node dist/index.js
```

---

## 📊 デプロイ手順

### Phase 1: Vercelプロジェクト作成
1. Vercelダッシュボードで「New Project」
2. GitHubリポジトリを接続
3. Framework Presetを「Next.js」に設定
4. 「Deploy」をクリック

### Phase 2: データベース設定
1. Vercel Dashboard → Storage → Create Database
2. 「Postgres」を選択
3. リージョンを選択（推奨: Tokyo）
4. データベース名を設定
5. プロジェクトに接続

### Phase 3: 環境変数設定
1. Project Settings → Environment Variables
2. 上記の必要な環境変数を全て設定
3. Production, Preview, Developmentの全環境に適用

### Phase 4: Google OAuth設定
1. Google Cloud Console → APIs & Services → Credentials
2. 「Authorized redirect URIs」に以下を追加:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`

### Phase 5: デプロイ実行
1. 環境変数設定後、再デプロイを実行
2. Build logsでエラーがないことを確認
3. Functions logsで実行時エラーがないことを確認

---

## 🔍 デプロイ後の確認チェックリスト

### 🟢 基本機能確認
- [ ] トップページが正常に表示される
- [ ] Google認証でログイン・ログアウトが可能
- [ ] 投稿フォームが正常に動作する
- [ ] タイムラインに投稿が表示される
- [ ] グッドボタンが動作し、ポイントが反映される
- [ ] 通知システムが正常に動作する

### 🟢 画面・レスポンシブ確認
- [ ] PC環境での表示確認
- [ ] スマートフォン環境での表示確認
- [ ] タブレット環境での表示確認
- [ ] 各ページ（ランキング、分析、プロフィール）の表示確認

### 🟢 データベース確認
- [ ] Prismaマイグレーションが正常に適用されている
- [ ] 投稿データが正常に保存される
- [ ] ポイント取引履歴が正常に記録される
- [ ] 通知データが正常に作成される

### 🟢 パフォーマンス確認
- [ ] ページ読み込み速度が適切（< 3秒）
- [ ] API応答速度が適切（< 1秒）
- [ ] データベースクエリが最適化されている
- [ ] 不要なデータ取得がない

### 🟢 セキュリティ確認
- [ ] 環境変数が正しく設定されている
- [ ] 認証が必要なAPIが保護されている
- [ ] XSS、CSRF対策が適切に実装されている
- [ ] データベースへの直接アクセスが制限されている

---

## 🚨 トラブルシューティング

### よくある問題と解決策

#### 1. ビルドエラー
```bash
# Prisma関連エラー
Error: Cannot find module '@prisma/client'

# 解決策
npm install @prisma/client
npx prisma generate
```

#### 2. 認証エラー
```bash
# NextAuth URL設定エラー
Error: Please define a NEXTAUTH_URL environment variable

# 解決策
NEXTAUTH_URL=https://your-domain.vercel.app
```

#### 3. データベース接続エラー
```bash
# DATABASE_URL設定エラー
Error: Environment variable not found: DATABASE_URL

# 解決策
Vercel Dashboard → Settings → Environment Variables
DATABASE_URLが正しく設定されているか確認
```

---

## 📈 本番運用における注意事項

### 1. モニタリング
- Vercel Analytics の有効化
- エラーログの定期的な確認
- パフォーマンスメトリクスの監視

### 2. セキュリティ
- 定期的な依存関係の更新
- セキュリティパッチの適用
- 不要な権限の削除

### 3. バックアップ
- データベースの定期バックアップ
- 重要設定の文書化
- 災害復旧計画の策定

---

## 🎉 デプロイ完了後

### 次のステップ
1. **カスタムドメインの設定**（オプション）
2. **SSL証明書の確認**
3. **検索エンジン最適化**（SEO）
4. **アクセス解析の設定**
5. **ユーザーフィードバックの収集**

### 運用開始
- 本番環境での最終テスト
- ユーザーへの告知
- 運用ドキュメントの整備

---

## 📝 まとめ

このデプロイ計画に従って実行することで、NEXXDAOアプリケーションをVercelに安全かつ効率的にデプロイできます。各フェーズを慎重に実行し、チェックリストを確認しながら進めることで、本番環境での安定した運用を実現できます。

**重要**: データベースのマイグレーションとGoogle OAuthの設定は特に注意深く行ってください。これらの設定ミスは本番環境でのサービス停止につながる可能性があります。