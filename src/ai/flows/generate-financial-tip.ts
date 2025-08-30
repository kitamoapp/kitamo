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
  currency: z.string().describe('The currency of the financial amounts.'),
  demographicArea: z
    .string()
    .describe('The demographic area of the user (e.g., "urban", "suburban", "rural").'),
  financialBackground: z
    .string()
    .describe(
      'A brief description of the user\'s financial background (e.g., "student", "young professional", "family with kids").'
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
  prompt: `You are a personal finance advisor. Based on the user's income, expenses, spending categories, demographic area, and financial background, provide a personalized financial tip. The currency is in {{currency}}.

Income: {{income}}
Expenses: {{expenses}}
Spending Categories:
{{#each spendingCategories}}
  - {{key}}: {{value}}
{{/each}}
Demographic Area: {{demographicArea}}
Financial Background: {{financialBackground}}

Provide a concise, actionable, and highly relevant financial tip based on all this information.`,
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
