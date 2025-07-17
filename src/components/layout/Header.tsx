'use client';

import { useState } from 'react';
import Link from 'next/link';
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

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
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
              className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white font-bold text-lg">U</span>
            </motion.div>
            <motion.span 
              className="text-xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Unipos
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
                        <Badge
                          size="sm"
                          color="danger"
                          className="absolute -top-1 -right-1"
                        >
                          3
                        </Badge>
                      </motion.div>
                    </Button>
                  </motion.div>
                </PopoverTrigger>
            <PopoverContent className="w-80">
              <Card className="card-gradient border-0">
                <CardHeader>
                  <h3 className="font-semibold text-white">通知</h3>
                </CardHeader>
                <CardBody className="max-h-80 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer">
                      <Avatar size="sm" name="田中" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white" />
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-semibold">田中さん</span>があなたに感謝を送りました
                        </p>
                        <p className="text-xs text-white/60 mt-1">2時間前</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer">
                      <Avatar size="sm" name="佐藤" className="bg-gradient-to-r from-green-500 to-blue-500 text-white" />
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-semibold">佐藤さん</span>があなたの投稿にリアクションしました
                        </p>
                        <p className="text-xs text-white/60 mt-1">5時間前</p>
                      </div>
                    </div>
                  </div>
                  <Divider className="my-4 bg-white/20" />
                  <Button variant="light" className="text-white hover:bg-white/10" fullWidth>
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="light" className="p-0 min-w-0 gap-2 text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-md">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Avatar size="sm" name={session?.user?.name || "ユーザー"} className="bg-gradient-to-r from-pink-500 to-violet-500 text-white" />
                      </motion.div>
                      <span className="hidden md:block text-sm font-medium">{session?.user?.name || "ユーザー"}</span>
                    </Button>
                  </motion.div>
                </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="profile" startContent={<User className="w-4 h-4" />}>
                <Link href="/profile">プロフィール</Link>
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings className="w-4 h-4" />}>
                <Link href="/settings">設定</Link>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<LogOut className="w-4 h-4" />} onClick={handleLogout}>
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