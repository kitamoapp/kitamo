
'use client';

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

export function ReferralFaq() {
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
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
