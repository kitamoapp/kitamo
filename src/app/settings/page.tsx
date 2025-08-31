
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
import { Separator } from '@/components/ui/separator';
import { RecruitUserDialog } from '@/components/referrals/recruit-user-dialog';

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and notification preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="biometric-login">Biometric Login</Label>
                <p className="text-sm text-muted-foreground">
                  Use your fingerprint or face to log in to your account.
                </p>
              </div>
              <Switch
                id="biometric-login"
                aria-label="Toggle biometric login"
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
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive emails about your account activity and reminders.
                </p>
              </div>
              <Switch
                id="email-notifications"
                aria-label="Toggle email notifications"
              />
            </div>
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications on your devices for instant updates.
                </p>
              </div>
              <Switch
                id="push-notifications"
                aria-label="Toggle push notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Developer</CardTitle>
            <CardDescription>
              These settings are for demonstration purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label>Simulate New User</Label>
                <p className="text-sm text-muted-foreground">
                  Add a new user to your referral network to see how your earnings change.
                </p>
              </div>
              <RecruitUserDialog />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
