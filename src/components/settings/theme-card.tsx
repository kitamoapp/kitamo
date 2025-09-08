
'use client';

import { useTheme } from 'next-themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '../ui/button';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeCard() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'Light', value: 'light', icon: Sun },
    { name: 'Dark', value: 'dark', icon: Moon },
    { name: 'System', value: 'system', icon: Monitor },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your interface.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
          {themes.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTheme(t.value)}
              className={cn(
                'justify-start',
                theme === t.value &&
                  'bg-background text-foreground shadow-sm hover:bg-background'
              )}
            >
              <t.icon className="mr-2 h-4 w-4" />
              {t.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
