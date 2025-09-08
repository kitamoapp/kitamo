
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
      question: 'How do I invite a friend?',
      answer:
        "Simply share your unique invite code with them. When they sign up using your code and subscribe to a paid plan, you'll earn rewards for helping them and the community grow.",
    },
    {
      question: 'What rewards do I get for helping someone join?',
      answer: `Your earning potential depends on your subscription tier. Higher tiers earn a larger bonus from both direct and indirect connections in your community. For example, Lite members earn a 40% bonus from matched volume, while Max members earn an 85% bonus.`,
    },
    {
      question: 'How many people can I invite?',
      answer: 'There is no limit to how many friends you can help by inviting them to the community!',
    },
    {
      question: 'How do subscription tiers work?',
      answer:
        'As your community grows with more active members, you can unlock higher subscription tiers. Each tier increases your maximum earning potential and the rewards you get for helping the community.',
    },
    {
      question: 'What are community milestones?',
      answer:
        'Milestones are goals based on the number of active users in your community. Reaching a milestone unlocks a new subscription tier with a higher earning potential.',
    },
    {
      question: 'When will I see my bonus?',
      answer:
        'Your community rewards will be credited to your account as your connections generate revenue.',
    },
  ];

  const handleFeedback = (index: number, helpful: boolean) => {
    setFeedback((prev) => ({ ...prev, [index]: true }));
    toast({
      title: 'Feedback Received',
      description: "Thank you for helping us improve!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Everything you need to know about our community program.
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
                       <p className="text-sm text-muted-foreground text-center">Thank you for your feedback!</p>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground">
                          Was this helpful?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleFeedback(index, true)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleFeedback(index, false)}
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
