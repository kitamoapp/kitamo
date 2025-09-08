
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

export function Faq() {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Record<number, boolean>>({});

  const faqs = [
    {
      question: 'How can I change my password?',
      answer:
        "You can change your password from the Settings page. Under the 'Security' section, you will find the 'Change Password' form where you can update your credentials.",
    },
    {
      question: 'How do I upgrade my subscription?',
      answer: `You can manage your subscription plan by navigating to the 'Subscriptions' page from the main menu. There you can see all available plans and choose the one that best fits your needs.`,
    },
    {
      question: 'Where can I see a breakdown of my spending?',
      answer: "The Dashboard features an 'Expense Breakdown' chart for Pro and Max users, which categorizes your spending. For a full list of all transactions, visit the 'Transactions' page.",
    },
    {
      question: 'How do the community rewards work?',
      answer:
        'When you help friends get started with the app on a paid plan, you unlock community rewards. Your bonus is based on your subscription tier and the financial activity of the community members you helped bring in. You can track this on the Community page.',
    },
    {
      question: 'How do I enable push notifications?',
      answer:
        "Go to the 'Settings' page. Under the 'Account & Notifications' section, you can toggle the 'Push Notifications' switch. Your browser will ask you for permission, which you must grant to receive alerts.",
    },
  ];

  const handleFeedback = (index: number, helpful: boolean) => {
    setFeedback((prev) => ({ ...prev, [index]: true }));
    toast({
      title: 'Feedback Received',
      description: "Thank you for helping us improve our support answers!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Asked Questions</CardTitle>
        <CardDescription>
          Find quick answers to common questions below.
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
