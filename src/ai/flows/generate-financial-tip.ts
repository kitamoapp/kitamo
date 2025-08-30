'use server';

/**
 * @fileOverview A flow for generating personalized financial tips based on user's financial history.
 *
 * - generateFinancialTip - A function that generates financial tips.
 * - FinancialTipInput - The input type for the generateFinancialTip function.
 * - FinancialTipOutput - The return type for the generateFinancialTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialTipInputSchema = z.object({
  income: z.number().describe('The total income of the user.'),
  expenses: z.number().describe('The total expenses of the user.'),
  spendingCategories: z
    .record(z.string(), z.number())
    .describe(
      'A record of spending categories and the amount spent in each category.'
    ),
});
export type FinancialTipInput = z.infer<typeof FinancialTipInputSchema>;

const FinancialTipOutputSchema = z.object({
  tip: z.string().describe('A personalized financial tip for the user.'),
});
export type FinancialTipOutput = z.infer<typeof FinancialTipOutputSchema>;

export async function generateFinancialTip(input: FinancialTipInput): Promise<FinancialTipOutput> {
  return generateFinancialTipFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialTipPrompt',
  input: {schema: FinancialTipInputSchema},
  output: {schema: FinancialTipOutputSchema},
  prompt: `You are a personal finance advisor. Based on the user's income, expenses, and spending categories, provide a personalized financial tip.

Income: {{income}}
Expenses: {{expenses}}
Spending Categories:
{{#each spendingCategories}}
  - {{key}}: {{value}}
{{/each}}

Tip:`,
});

const generateFinancialTipFlow = ai.defineFlow(
  {
    name: 'generateFinancialTipFlow',
    inputSchema: FinancialTipInputSchema,
    outputSchema: FinancialTipOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
