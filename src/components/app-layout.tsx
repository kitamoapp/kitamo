
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LogOut,
  Settings,
  User,
  Moon,
  Sun,
  Monitor,
  LayoutDashboard,
  Users,
  CreditCard,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CurrencySwitcher } from './currency-switcher';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/referrals', label: 'Referrals', icon: Users },
  { href: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

function UserMenu() {
  const { setTheme } = useTheme();
  const { open, setOpen, state } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://picsum.photos/100/100`}
              alt="User avatar"
              data-ai-hint="person portrait"
            />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="truncate font-medium">User</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              user@example.com
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User</p>
            <p className="text-xs leading-none text-muted-foreground">
              user@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">
            <LogOut />
            <span>Log out</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
           <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="font-bold text-lg">K</span>
            </div>
            <span className="font-bold text-lg text-primary">KitaMo</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <UserMenu />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-8">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                {/* Add page titles here if needed */}
            </div>
            <div className="flex items-center gap-4">
                <CurrencySwitcher />
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
