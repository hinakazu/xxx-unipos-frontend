'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from '@heroui/react';
import { EnhancedButton } from '@/components/ui/EnhancedButton';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
    department: string | null;
  } | null;
  post: {
    id: string;
    content: string;
    points: number;
  } | null;
}

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // 通知データを取得
  const fetchNotifications = async () => {
    if (!session?.user?.id) return;
    
    setIsLoadingNotifications(true);
    try {
      const response = await fetch('/api/notifications?limit=5');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('通知取得エラー:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // 通知を既読にする
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('通知更新エラー:', error);
    }
  };

  // すべての通知を既読にする
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('通知更新エラー:', error);
    }
  };

  // 時間をフォーマット
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '数分前';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    if (diffInHours < 48) return '1日前';
    return `${Math.floor(diffInHours / 24)}日前`;
  };

  // セッションが変更されたときに通知を取得
  useEffect(() => {
    fetchNotifications();
  }, [session]);

  // 定期的に通知を取得（30秒ごと）
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const handleDropdownAction = (key: string) => {
    switch (key) {
      case 'profile':
        router.push('/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar maxWidth="full" className="glass-effect border-none bg-transparent backdrop-blur-xl">
        <NavbarBrand>
          <Link href="/" className="flex items-center space-x-2">
            <motion.div 
              className="w-8 h-8 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/nexx.png"
                alt="NEXXDAO Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              NEXXDAO
            </motion.span>
          </Link>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex gap-4" justify="center">
          {[
            { href: '/', label: 'タイムライン' },
            { href: '/ranking', label: 'ランキング' },
            { href: '/analytics', label: '分析' }
          ].map((item, index) => (
            <NavbarItem key={item.href}>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href} className="relative text-white/80 hover:text-white transition-colors font-medium group">
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: '100%' }}
                  />
                </Link>
              </motion.div>
            </NavbarItem>
          ))}
        </NavbarContent>

      <NavbarContent justify="end">
          <NavbarItem>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Input
                type="text"
                placeholder="検索..."
                startContent={<Search className="w-4 h-4 text-white/60" />}
                className="w-64"
                classNames={{
                  inputWrapper: "bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300",
                  input: "text-white placeholder:text-white/60"
                }}
              />
            </motion.div>
          </NavbarItem>
        
          <NavbarItem>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button isIconOnly variant="light" className="relative text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md">
                      <Bell className="w-5 h-5" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {unreadCount > 0 && (
                          <Badge
                            size="sm"
                            color="danger"
                            className="absolute -top-1 -right-1"
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </PopoverTrigger>
            <PopoverContent className="w-80">
              <Card className="card-gradient border-0">
                <CardHeader className="flex flex-row items-center justify-between">
                  <h3 className="font-semibold text-white">通知</h3>
                  {unreadCount > 0 && (
                    <Button
                      size="sm"
                      variant="light"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                      onClick={markAllAsRead}
                    >
                      すべて既読
                    </Button>
                  )}
                </CardHeader>
                <CardBody className="max-h-80 overflow-y-auto">
                  {isLoadingNotifications ? (
                    <div className="flex justify-center py-4">
                      <div className="text-white/60">読み込み中...</div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>新しい通知はありません</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-white/5' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <Avatar 
                            size="sm" 
                            name={notification.sender?.name || 'U'} 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white flex-shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">
                              <span className="font-semibold">{notification.sender?.name || 'システム'}</span>
                              {notification.type === 'POST_RECEIVED' && 'から感謝が送られました'}
                              {notification.type === 'LIKE_RECEIVED' && 'があなたの投稿にグッドしました'}
                            </p>
                            <p className="text-xs text-white/60 mt-1 truncate">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-white/50">{formatTimeAgo(notification.createdAt)}</p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <Divider className="my-4 bg-white/20" />
                  <Button 
                    variant="light" 
                    className="text-white hover:bg-white/10" 
                    fullWidth
                    onClick={() => router.push('/notifications')}
                  >
                    すべての通知を見る
                  </Button>
                </CardBody>
              </Card>
            </PopoverContent>
          </Popover>
            </motion.div>
          </NavbarItem>

          <NavbarItem>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="light" className="p-0 min-w-0 gap-2 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md">
                    <Avatar size="sm" name={session?.user?.name || "ユーザー"} className="bg-gradient-to-r from-pink-500 to-violet-500 text-white" />
                    <span className="hidden md:block text-sm font-medium">{session?.user?.name || "ユーザー"}</span>
                  </Button>
                </DropdownTrigger>
            <DropdownMenu onAction={(key) => handleDropdownAction(key as string)}>
              <DropdownItem 
                key="profile" 
                startContent={<User className="w-4 h-4" />}
              >
                プロフィール
              </DropdownItem>
              <DropdownItem 
                key="settings" 
                startContent={<Settings className="w-4 h-4" />}
              >
                設定
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                startContent={<LogOut className="w-4 h-4" />}
              >
                ログアウト
              </DropdownItem>
            </DropdownMenu>
              </Dropdown>
            </motion.div>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </motion.div>
  );
}