
'use client';

import { AppLayout } from '@/components/app-layout';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeCard } from '@/components/upgrade-card';
import { AssistantChat } from '@/components/assistant/assistant-chat';

export default function AssistantPage() {
  const { currentTier } = useSubscription();

  const canAccessAssistant =
    currentTier.name === 'Gold' || currentTier.name === 'Platinum';

  return (
    <AppLayout>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
      </div>

      {canAccessAssistant ? (
        <AssistantChat />
      ) : (
        <div className="mt-16">
          <UpgradeCard
            title="Unlock Your AI Assistant"
            description="Upgrade to Gold or Platinum to get access to a personal AI assistant for priority support and dedicated account management."
            buttonText="Upgrade to Gold"
          />
        </div>
      )}
    </AppLayout>
  );
}
