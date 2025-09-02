
'use client';

import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Check, Trash2 } from 'lucide-react';
import type { Notification } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border transition-colors',
        notification.read
          ? 'bg-transparent text-muted-foreground'
          : 'bg-primary/5 text-foreground'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full bg-background mt-1',
          notification.read ? 'opacity-60' : ''
        )}
      >
        {notification.icon}
      </div>
      <div className="flex-1">
        <p
          className={cn(
            'font-semibold',
            notification.read ? 'font-normal' : ''
          )}
        >
          {notification.title}
        </p>
        <p className="text-sm">{notification.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.date), {
            addSuffix: true,
          })}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {!notification.read && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Mark as read</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as read</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(notification.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete notification</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete notification</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
