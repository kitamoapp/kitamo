
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
import { REFERRAL_PERCENTAGES } from '@/lib/data';


export function ReferralFaq() {
  const faqs = [
    {
      question: 'How do I refer a friend?',
      answer:
        "Simply share your unique referral code with them. When they sign up using your code and subscribe to a paid plan, you'll start earning.",
    },
    {
      question: 'What do I get for a successful referral?',
      answer: `For each friend that signs up and becomes an active user on a paid plan, you will receive ${REFERRAL_PERCENTAGES.direct * 100}% of the revenue they generate. If they refer others, you'll earn ${REFERRAL_PERCENTAGES.indirect * 100}% from those indirect referrals as well.`,
    },
    {
      question: 'How many people can I refer?',
      answer: 'There is no limit to how many friends you can refer!',
    },
    {
      question: 'How do subscription tiers work?',
      answer:
        'As you refer more active users, you will unlock higher subscription tiers. Each tier increases your maximum earning potential from referrals.',
    },
    {
      question: 'What are referral milestones?',
      answer:
        'Milestones are goals based on the number of active users you have referred. Reaching a milestone unlocks a new subscription tier with a higher earning potential.',
    },
    {
      question: 'When will I see my bonus?',
      answer:
        "Your referral earnings will be credited to your account as your referrals generate revenue.",
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
