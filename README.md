# NEXXDAO Frontend

社内のコミュニケーションを促進し、感謝と称賛を可視化するプラットフォームのフロントエンドアプリケーション

## 📋 概要

NEXXDAO Frontendは、社員同士の感謝や称賛を投稿・共有できるWebアプリケーションです。ポイントシステムを通じて価値を可視化し、チームワークの向上を支援します。

## 🚀 主要機能

### 📝 投稿機能
- 感謝・称賛・成果報告の投稿
- ポイント付与による価値の可視化
- 画像添付対応
- ハッシュタグ機能

### 💬 コミュニケーション
- リアクション機能（いいね、愛、祝福など）
- コメント・返信機能
- リアルタイム通知

### 📊 分析・ランキング
- 個人・部署別の統計情報
- 週次・月次ランキング
- バッジシステム

### 👤 ユーザー機能
- プロフィール管理
- ポイント履歴
- 通知設定

## 🛠️ 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React Hooks
- **Form Handling**: React Hook Form + Zod
- **Animation**: Framer Motion
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel

## 📦 セットアップ

### 前提条件
- Node.js 18.0.0以上
- npm または yarn

### インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd xxx-unipos-frontend

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 環境変数

`.env.local`ファイルを作成し、必要な環境変数を設定してください：

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/unipos

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# File Upload
NEXT_PUBLIC_UPLOAD_URL=https://your-upload-service.com
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── globals.css        # グローバルスタイル
│   ├── ranking/           # ランキングページ
│   ├── analytics/         # 分析ページ
│   ├── profile/           # プロフィールページ
│   └── settings/          # 設定ページ
├── components/             # UIコンポーネント
│   ├── layout/            # レイアウト関連
│   │   └── Header.tsx     # ヘッダーコンポーネント
│   ├── post/              # 投稿関連
│   │   └── PostForm.tsx   # 投稿フォーム
│   ├── timeline/          # タイムライン関連
│   │   ├── Timeline.tsx   # タイムライン
│   │   └── PostCard.tsx   # 投稿カード
│   ├── user/              # ユーザー関連
│   │   └── UserStats.tsx  # ユーザー統計
│   └── ui/                # 共通UIコンポーネント
├── lib/                   # ユーティリティ
├── hooks/                 # カスタムフック
├── types/                 # 型定義
└── utils/                 # ヘルパー関数
```

## 🎨 デザインシステム

### カラーパレット
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### 投稿タイプ
- **感謝**: Blue theme
- **称賛**: Green theme
- **成果報告**: Purple theme

### レスポンシブデザイン
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 テスト

```bash
# 単体テスト実行
npm run test

# ウォッチモードでテスト実行
npm run test:watch

# カバレッジ付きテスト実行
npm run test:coverage
```

## 🚀 デプロイ

### Vercelにデプロイ

```bash
# Vercel CLIをインストール
npm install -g vercel

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

### 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

- `NEXT_PUBLIC_API_URL`
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_UPLOAD_URL`

## 📋 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: 本番用ビルドを作成
- `npm run start`: 本番サーバーを起動
- `npm run lint`: ESLintでコードをチェック
- `npm run type-check`: TypeScriptの型チェック
- `npm run format`: Prettierでコードをフォーマット
- `npm run format:check`: フォーマットチェック

## 🔧 開発ガイドライン

### コーディング規約
- TypeScriptを使用
- ESLint + Prettierでコード品質を保持
- コンポーネントは小さく、再利用可能に設計
- Props interfaceを明確に定義

### コミット規約
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント更新
- style: スタイル修正
- refactor: リファクタリング
- test: テスト追加・修正

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `bugfix/*`: バグ修正

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。

## 📞 サポート

質問やサポートが必要な場合は、以下にお問い合わせください：

- Email: support@unipos.com
- Slack: #unipos-support

## 🗺️ ロードマップ

- [ ] モバイルアプリ連携
- [ ] Slack/Teams連携
- [ ] AI機能（感情分析、レコメンデーション）
- [ ] 多言語対応
- [ ] テーマカスタマイズ機能