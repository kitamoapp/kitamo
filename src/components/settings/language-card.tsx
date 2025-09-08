
'use client';

import { useSettings } from '@/hooks/use-settings';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español (Spanish)' },
    { value: 'fr', label: 'Français (French)' },
    { value: 'de', label: 'Deutsch (German)' },
    { value: 'it', label: 'Italiano (Italian)' },
    { value: 'pt', label: 'Português (Portuguese)' },
    { value: 'ru', label: 'Русский (Russian)' },
    { value: 'ja', label: '日本語 (Japanese)' },
    { value: 'ko', label: '한국어 (Korean)' },
    { value: 'zh-CN', label: '简体中文 (Simplified Chinese)' },
    { value: 'zh-TW', label: '繁體中文 (Traditional Chinese)' },
    { value: 'ar', label: 'العربية (Arabic)' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'nl', label: 'Nederlands (Dutch)' },
    { value: 'sv', label: 'Svenska (Swedish)' },
    { value: 'fi', label: 'Suomi (Finnish)' },
    { value: 'da', label: 'Dansk (Danish)' },
    { value: 'no', label: 'Norsk (Norwegian)' },
    { value: 'pl', label: 'Polski (Polish)' },
    { value: 'tr', label: 'Türkçe (Turkish)' },
    { value: 'vi', label: 'Tiếng Việt (Vietnamese)' },
    { value: 'th', label: 'ไทย (Thai)' },
];

export function LanguageCard() {
  const { settings, updateSetting } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>
          Choose your preferred language for the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="language-select">Select Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => updateSetting('language', value)}
          >
            <SelectTrigger id="language-select">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
