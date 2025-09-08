
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/context/currency-context';

interface SetGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentGoal: number;
  onSetGoal: (goal: number) => void;
}

export function SetGoalDialog({ open, onOpenChange, currentGoal, onSetGoal }: SetGoalDialogProps) {
  const [goal, setGoal] = useState(currentGoal);
  const { toast } = useToast();
  const { currency } = useCurrency();

  const handleSave = () => {
    if (goal < 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Goal must be a positive number.',
        variant: 'destructive',
      });
      return;
    }
    onSetGoal(goal);
    toast({
      title: 'Goal Updated!',
      description: 'Your new emergency fund target has been saved.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Emergency Fund Goal</DialogTitle>
          <DialogDescription>
            Define your personal savings target. We recommend at least one month of your average expenses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-amount">Your Goal ({currency})</Label>
            <Input
              id="goal-amount"
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              placeholder="e.g., 50000"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
