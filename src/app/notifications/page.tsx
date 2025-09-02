
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

const initialNotifications: Notification[] = [];

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
