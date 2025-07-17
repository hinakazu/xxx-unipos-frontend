import { Header } from '@/components/layout/Header';
import { SettingsGeneral } from '@/components/settings/SettingsGeneral';
import { SettingsNotifications } from '@/components/settings/SettingsNotifications';
import { SettingsPrivacy } from '@/components/settings/SettingsPrivacy';
import { SettingsAccount } from '@/components/settings/SettingsAccount';

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="card-gradient p-6">
            <h1 className="text-2xl font-bold text-white mb-2">設定</h1>
            <p className="text-white/80">アカウントとアプリケーションの設定を管理できます</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SettingsGeneral />
              <SettingsNotifications />
            </div>
            <div className="space-y-6">
              <SettingsPrivacy />
              <SettingsAccount />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}