
'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { NotificationItem } from '@/components/notifications/notification-item';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, DollarSign, Users, Award, AlertTriangle } from 'lucide-react';
import type { NotificationType, Notification } from '@/lib/types';

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_referral',
    title: 'New Referral!',
    description: 'John Doe just signed up using your referral code.',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    icon: <Users className="h-6 w-6 text-blue-500" />,
  },
  {
    id: '2',
    type: 'milestone',
    title: 'Milestone Achieved!',
    description: "You've reached the 'Pro' tier. Keep it up!",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    icon: <Award className="h-6 w-6 text-yellow-500" />,
  },
  {
    id: '3',
    type: 'payout',
    title: 'Payout Processed',
    description: 'Your monthly earnings of $250.00 have been sent.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    icon: <DollarSign className="h-6 w-6 text-green-500" />,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Action Required',
    description: 'Your subscription payment is due in 3 days.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;


  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay up to date with your account activity.
              {unreadCount > 0 && ` You have ${unreadCount} unread messages.`}
            </p>
          </div>
          <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Here's what has happened recently in your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
                <div className="space-y-4">
                {notifications.map((notification) => (
                    <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                    />
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 text-center py-10">
                    <Bell className="h-16 w-16 text-muted-foreground/50" />
                    <p className="text-muted-foreground">You have no notifications yet.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
