
'use client';

import { useSettings } from '@/hooks/use-settings';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function BiometricLoginCard() {
    const { settings, updateSetting } = useSettings();

    return (
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
                onCheckedChange={(checked) => updateSetting('biometricLogin', checked)}
            />
        </div>
    )
}
