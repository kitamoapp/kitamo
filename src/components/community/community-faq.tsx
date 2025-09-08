
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

export function CommunityFaq() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Record<number, boolean>>({});

  const faqs = [
    {
      question: 'How do I help a friend get started?',
      answer:
        "Simply share your unique code with them. When they use your code while getting started and subscribe to a paid plan, you'll be rewarded for helping them and the community grow.",
    },
    {
      question: 'What rewards do I get for helping someone?',
      answer: `Your reward potential depends on your subscription tier. Higher tiers unlock a larger bonus from community activity. For example, Lite subscribers receive a 40% bonus from community activity, while Max subscribers receive an 85% bonus.`,
    },
    {
      question: 'How many people can I help?',
      answer: 'There is no limit to how many friends you can help by bringing them into the community!',
    },
    {
      question: 'How do subscription tiers work?',
      answer:
        'As your community grows, you can unlock higher subscription tiers. Each tier increases your maximum bonus potential and the rewards you get for helping the community.',
    },
    {
      question: 'What are community milestones?',
      answer:
        'Milestones are goals based on the number of active people in your community. Reaching a milestone unlocks a new subscription tier with a higher reward potential.',
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
