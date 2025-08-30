
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

const faqs = [
  {
    question: 'How do I refer a friend?',
    answer:
      "Simply share your unique referral code with them. When they sign up using your code, you'll both receive a bonus.",
  },
  {
    question: 'What do I get for a successful referral?',
    answer:
      'For each friend that signs up and becomes an active user, you will receive a $10 credit to your account. Your friend will also receive a $10 credit.',
  },
  {
    question: 'How many people can I refer?',
    answer: 'There is no limit to how many friends you can refer!',
  },
  {
    question: 'When will I see my bonus?',
    answer:
      "Your referral bonus will be credited to your account as soon as your referred friend's status becomes 'Active'.",
  },
];

export function ReferralFaq() {
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
