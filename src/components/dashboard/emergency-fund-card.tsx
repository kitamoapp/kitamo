
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTransactions } from '@/context/transaction-context';
import { useReminders } from '@/context/reminder-context';
import { getLoanRiskAdvice } from '@/ai/flows/loan-advisor-flow';
import { AlertCircle, Loader2, ShieldCheck, ShieldAlert, PiggyBank, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import { useCurrency } from '@/context/currency-context';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeCard } from '../upgrade-card';
import { Button } from '../ui/button';
import { SetGoalDialog } from './set-goal-dialog';
import { useGoals } from '@/context/goal-context';

export function EmergencyFundCard() {
  const { transactions } = useTransactions();
  const { reminders } = useReminders();
  const { formatCurrency } = useCurrency();
  const { currentTier } = useSubscription();
  const { emergencyFundGoal, setEmergencyFundGoal } = useGoals();

  const [advice, setAdvice] = useState('');
  const [status, setStatus] = useState<'onTrack' | 'atRisk' | 'noData' | 'loading'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [recommendedTarget, setRecommendedTarget] = useState(0);
  const [currentFund, setCurrentFund] = useState(0);
  const [showGoalDialog, setShowGoalDialog] = useState(false);

  const canUseFeature = currentTier.name !== 'Free';
  const displayTarget = emergencyFundGoal || recommendedTarget;

  useEffect(() => {
    if (!canUseFeature) {
        setStatus('noData');
        return;
    }

    const fetchAdvice = async () => {
      setStatus('loading');
      setError(null);
      try {
        const result = await getLoanRiskAdvice({
           transactions, 
           reminders,
           customEmergencyFundTarget: emergencyFundGoal > 0 ? emergencyFundGoal : undefined,
        });
        setAdvice(result.advice);
        setStatus(result.status);
        setRecommendedTarget(result.recommendedEmergencyFundTarget);
        setCurrentFund(result.currentEmergencyFund);
      } catch (err) {
        console.error('Error fetching loan risk advice:', err);
        setError("Sorry, we couldn't generate advice at this time. Please try again later.");
      }
    };

    fetchAdvice();
  }, [transactions, reminders, canUseFeature, emergencyFundGoal]);

  const progress = displayTarget > 0 ? (currentFund / displayTarget) * 100 : 0;

  const renderIcon = () => {
    switch (status) {
        case 'onTrack': return <ShieldCheck className="h-8 w-8 text-green-500" />;
        case 'atRisk': return <ShieldAlert className="h-8 w-8 text-amber-500" />;
        case 'noData': return <PiggyBank className="h-8 w-8 text-primary" />;
        default: return <Loader2 className="h-8 w-8 animate-spin" />;
    }
  }
  
  if (!canUseFeature) {
    return (
        <UpgradeCard 
            title="Unlock Your Financial Safety Net"
            description="Upgrade to get AI-powered advice on building your emergency fund and avoiding costly loans."
            buttonText="Upgrade for Security"
            featureIcon='ai'
        />
    )
  }
  
  if (status === 'noData' && !error) {
    return (
        <>
            <Card className="flex flex-col items-center justify-center text-center p-6 bg-muted/40">
                <CardHeader>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    {renderIcon()}
                </div>
                <CardTitle>Build Your Safety Net</CardTitle>
                <CardDescription>
                    {advice}
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setShowGoalDialog(true)}>Set a Goal</Button>
                </CardContent>
            </Card>
             <SetGoalDialog 
                open={showGoalDialog}
                onOpenChange={setShowGoalDialog}
                currentGoal={emergencyFundGoal}
                onSetGoal={setEmergencyFundGoal}
            />
        </>
    )
  }


  return (
    <>
      <Card>
        <CardHeader className="items-center text-center relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              {renderIcon()}
          </div>
          <CardTitle>Emergency Fund Status</CardTitle>
          <CardDescription>
              Your progress towards a financial safety net.
          </CardDescription>
          <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => setShowGoalDialog(true)}>
             <Edit className="h-4 w-4" />
             <span className="sr-only">Set custom goal</span>
           </Button>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing your finances...</span>
            </div>
          )}
          {error && (
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
          {status !== 'loading' && !error && (
              <div className='space-y-4'>
                  <div>
                      <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">
                              {formatCurrency(currentFund)} / {formatCurrency(displayTarget)}
                          </span>
                          <span className={cn("text-sm font-semibold", status === 'onTrack' && 'text-green-500', status === 'atRisk' && 'text-amber-500')}>
                            {status === 'onTrack' && "On Track"}
                            {status === 'atRisk' && "At Risk"}
                          </span>
                      </div>
                      <Progress value={progress} className={cn(status === 'atRisk' && "[&>div]:bg-amber-500")} />
                  </div>
                  <p className="text-sm text-muted-foreground italic text-center">
                      {advice}
                  </p>
              </div>
          )}
        </CardContent>
      </Card>

      <SetGoalDialog 
        open={showGoalDialog}
        onOpenChange={setShowGoalDialog}
        currentGoal={emergencyFundGoal}
        onSetGoal={setEmergencyFundGoal}
      />
    </>
  );
}
