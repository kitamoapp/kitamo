
'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
} from '@/components/ui/sidebar';
import {
  LogOut,
  Settings,
  User,
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Wallet,
  Calendar,
  Sparkles,
  Heart,
  Briefcase,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Wallet },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/community', label: 'Community', icon: Users },
];

function UserMenu() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className='flex flex-col gap-1 w-full'>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user?.photoURL || `https://picsum.photos/100/100`}
              alt="User avatar"
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="truncate font-medium">{user?.displayName || 'User'}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {user?.email}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
           <Link href="/dashboard" className="flex items-center gap-2 p-2">
            <span className="font-bold text-lg text-primary">KitaMo</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
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
            </div>
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" onClick={() => router.push('/notifications')}>
                 <Bell />
                 <span className="sr-only">Notifications</span>
               </Button>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
