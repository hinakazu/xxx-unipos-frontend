'use client';

import { useState } from 'react';
import { User, Key, Trash2, Download, AlertTriangle } from 'lucide-react';

export function SettingsAccount() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: パスワード変更処理
    console.log('Password change:', passwords);
    setIsChangingPassword(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleAccountDelete = () => {
    // TODO: アカウント削除処理
    console.log('Account deletion requested');
    setIsDeleteDialogOpen(false);
  };

  const handleDataExport = () => {
    // TODO: データエクスポート処理
    console.log('Data export requested');
  };

  return (
    <div className="card-gradient p-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-5 h-5 text-white" />
        <h2 className="text-xl font-bold text-white">アカウント設定</h2>
      </div>

      <div className="space-y-6">
        {/* アカウント情報 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">アカウント情報</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">メールアドレス</span>
              <span className="text-white">taro.yamada@company.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">ユーザーID</span>
              <span className="text-white">yamada_taro</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">登録日</span>
              <span className="text-white">2020年4月1日</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80">最終ログイン</span>
              <span className="text-white">2024年1月15日 10:30</span>
            </div>
          </div>
        </div>

        {/* パスワード変更 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">パスワード</h3>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>パスワード変更</span>
            </button>
          </div>

          {isChangingPassword && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">現在のパスワード</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({...prev, current: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">新しいパスワード</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({...prev, new: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">新しいパスワード（確認）</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({...prev, confirm: e.target.value}))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  変更する
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>

        {/* データエクスポート */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">データエクスポート</h3>
              <p className="text-white/60 text-sm">あなたのアカウントデータをダウンロードできます</p>
            </div>
            <button
              onClick={handleDataExport}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>エクスポート</span>
            </button>
          </div>
        </div>

        {/* アカウント削除 */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-red-400">アカウント削除</h3>
              <p className="text-white/60 text-sm">アカウントを完全に削除します。この操作は元に戻せません。</p>
            </div>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>削除</span>
            </button>
          </div>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">アカウント削除の確認</h3>
            </div>
            <p className="text-white/80 mb-6">
              アカウントを削除すると、すべてのデータが完全に削除されます。
              この操作は元に戻すことができません。本当に削除しますか？
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleAccountDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                削除する
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}