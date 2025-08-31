
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function ReferralFaq() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Record<number, boolean>>({});

  const faqs = [
    {
      question: 'How do I refer a friend?',
      answer:
        "Simply share your unique referral code with them. When they sign up using your code and subscribe to a paid plan, you'll start earning.",
    },
    {
      question: 'What do I get for a successful referral?',
      answer: `Your earning potential depends on your subscription tier. Higher tiers earn a larger percentage from both direct and indirect referrals. For example, Silver members earn 15% from direct referrals and 5% from indirect, while Platinum members earn 35% and 25% respectively.`,
    },
    {
      question: 'How many people can I refer?',
      answer: 'There is no limit to how many friends you can refer!',
    },
    {
      question: 'How do subscription tiers work?',
      answer:
        'As you refer more active users, you will unlock higher subscription tiers. Each tier increases your maximum earning potential and the percentage you earn from referrals.',
    },
    {
      question: 'What are referral milestones?',
      answer:
        'Milestones are goals based on the number of active users you have referred. Reaching a milestone unlocks a new subscription tier with a higher earning potential.',
    },
    {
      question: 'When will I see my bonus?',
      answer:
        'Your referral earnings will be credited to your account as your referrals generate revenue.',
    },
  ];

  const handleFeedback = (index: number) => {
    setFeedback((prev) => ({ ...prev, [index]: true }));
    toast({
      title: 'Feedback Received',
      description: 'Thank you for your input!',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Everything you need to know about our referral program.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 text-left">
                  <p>{faq.answer}</p>
                  <div className="mt-4 pt-4 border-t border-dashed">
                    {feedback[index] ? (
                       <p className="text-sm text-muted-foreground">Thank you for your feedback!</p>
                    ) : (
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-muted-foreground">
                          Was this helpful?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleFeedback(index)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleFeedback(index)}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
