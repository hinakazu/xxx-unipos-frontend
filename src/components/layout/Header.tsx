'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
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

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <Navbar maxWidth="full" className="glass-effect border-none bg-transparent">
      <NavbarBrand>
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">U</span>
          </div>
          <span className="text-xl font-bold text-white">Unipos</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
            タイムライン
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/ranking" className="text-white/80 hover:text-white transition-colors font-medium">
            ランキング
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/analytics" className="text-white/80 hover:text-white transition-colors font-medium">
            分析
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Input
            type="text"
            placeholder="検索..."
            startContent={<Search className="w-4 h-4 text-white/60" />}
            className="w-64"
            classNames={{
              inputWrapper: "bg-white/10 border-white/20 hover:bg-white/20",
              input: "text-white placeholder:text-white/60"
            }}
          />
        </NavbarItem>
        
        <NavbarItem>
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button isIconOnly variant="light" className="relative text-white/80 hover:text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
                <Badge
                  size="sm"
                  color="danger"
                  className="absolute -top-1 -right-1"
                >
                  3
                </Badge>
              </Button>
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
        </NavbarItem>

        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" className="p-0 min-w-0 gap-2 text-white/80 hover:text-white hover:bg-white/10">
                <Avatar size="sm" name="山田太郎" className="bg-gradient-to-r from-pink-500 to-violet-500 text-white" />
                <span className="hidden md:block text-sm font-medium">山田太郎</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="profile" startContent={<User className="w-4 h-4" />}>
                プロフィール
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings className="w-4 h-4" />}>
                設定
              </DropdownItem>
              <DropdownItem key="logout" color="danger" startContent={<LogOut className="w-4 h-4" />}>
                ログアウト
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}