/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercelへのデプロイに最適化されたスタンドアロンモード
  output: 'standalone',
  experimental: {
    // App RouterでPrismaを正しく動作させるための設定
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    // Googleのプロフィール画像などをNext/Imageで最適化するために許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // 本番ビルドで不要なconsole.logを削除
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;