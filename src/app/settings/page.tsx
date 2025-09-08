
'use client';

import { AppLayout } from '@/components/app-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';
import type { SettingKey } from '@/hooks/use-settings';
import { Skeleton } from '@/components/ui/skeleton';
import { MfaCard } from '@/components/settings/mfa-card';
import { ThemeCard } from '@/components/settings/theme-card';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Shield, User, Briefcase, Award, Gem } from 'lucide-react';
import type { SubscriptionTier } from '@/lib/types';
import { LanguageCard } from '@/components/settings/language-card';


const PlanBadge = ({ tier }: { tier: SubscriptionTier }) => {
  const getIcon = () => {
    switch (tier.name) {
        case 'Free': return <Shield className="h-4 w-4" />;
        case 'Personal': return <User className="h-4 w-4" />;
        case 'Lite': return <Briefcase className="h-4 w-4" />;
        case 'Pro': return <Award className="h-4 w-4" />;
        case 'Max': return <Gem className="h-4 w-4" />;
        default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Badge
      className={cn(
        'text-base gap-2',
        tier.name === 'Max' && 'border-sky-500/50 text-sky-500 bg-sky-500/10',
        tier.name === 'Pro' && 'border-amber-500/50 text-amber-500 bg-amber-500/10',
        tier.name === 'Lite' && 'border-slate-500/50 text-slate-500 bg-slate-500/10',
        tier.name === 'Personal' && 'border-green-500/50 text-green-500 bg-green-500/10',
        tier.name === 'Free' && 'border-gray-500/50 text-gray-500 bg-gray-500/10'
      )}
      variant="outline"
    >
      {getIcon()}
      {tier.name}
    </Badge>
  );
};


function SettingsSkeleton() {
  return (
    <div className="space-y-8">
       <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            <div className="text-sm text-muted-foreground">
                <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-1">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
             <div className="text-sm text-muted-foreground">
                <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-1">
                 <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-1">
                 <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </CardContent>
        </Card>
    </div>
  )
}


export default function SettingsPage() {
  const { settings, updateSetting, isLoaded } = useSettings();
  const { currentTier } = useSubscription();
  const router = useRouter();


  const handleSettingChange = async (setting: SettingKey, checked: boolean) => {
    await updateSetting(setting, checked);
  };

  if (!isLoaded) {
    return (
      <AppLayout>
        <SettingsSkeleton />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and notification preferences.
          </p>
        </div>

        <ThemeCard />
        <LanguageCard />
        <MfaCard />

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Manage your account and subscription settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="biometric-login" className="text-base">Biometric Login</Label>
                <p className="text-sm text-muted-foreground">
                  Use your fingerprint or face to log in to your account.
                </p>
              </div>
              <Switch
                id="biometric-login"
                aria-label="Toggle biometric login"
                checked={settings.biometricLogin}
                onCheckedChange={(checked) => handleSettingChange('biometricLogin', checked)}
              />
            </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-0.5">
                    <p className="text-base font-medium">Subscription Plan</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            You are currently on the
                        </p>
                         <PlanBadge tier={currentTier} />
                    </div>
                </div>
                <Button onClick={() => router.push('/subscriptions')} variant="outline" className='mt-4 sm:mt-0 w-full sm:w-auto'>
                    Manage Subscription
                </Button>
            </div>
             <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="auto-renew" className="text-base">Auto-renew Subscription</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically renew your subscription at the end of the billing cycle.
                </p>
              </div>
              <Switch
                id="auto-renew"
                aria-label="Toggle auto-renew subscription"
                checked={settings.autoRenewSubscription}
                onCheckedChange={(checked) => handleSettingChange('autoRenewSubscription', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose how you want to be notified.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about your account activity and reminders.
                </p>
              </div>
              <Switch
                id="email-notifications"
                aria-label="Toggle email notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications on your devices for instant updates.
                </p>
              </div>
              <Switch
                id="push-notifications"
                aria-label="Toggle push notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
