
'use client';

import { Lock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

interface UpgradeCardProps {
  title: string;
  description: string;
  buttonText: string;
  featureIcon?: 'lock' | 'ai';
}

export function UpgradeCard({
  title,
  description,
  buttonText,
  featureIcon = 'lock',
}: UpgradeCardProps) {
  const router = useRouter();

  const Icon = featureIcon === 'ai' ? Sparkles : Lock;

  return (
    <Card className="flex flex-col items-center justify-center text-center p-6 bg-muted/40">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => router.push('/subscriptions')}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

    