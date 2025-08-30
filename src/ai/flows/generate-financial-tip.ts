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
    .describe('The demographic area of the user (e.g., "Urban City", "Suburban Area", "Rural Countryside"). This helps understand cost of living.'),
  financialBackground: z
    .string()
    .describe(
      'A brief description of the user\'s financial situation or profession (e.g., "student with part-time job", "young professional in tech", "family with two kids", "freelancer").'
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
  prompt: `You are a friendly and encouraging personal finance advisor. Your goal is to provide a single, actionable, and personalized financial tip.

Based on the user's financial details below, generate a concise and highly relevant tip. The user's currency is {{currency}}.

**User's Financial Profile:**
*   **Total Income:** {{income}}
*   **Total Expenses:** {{expenses}}
*   **Living Area:** {{demographicArea}}
*   **Financial Background:** {{financialBackground}}

**Spending Breakdown:**
{{#each spendingCategories}}
*   **{{@key}}:** {{this}}
{{/each}}

Analyze all this information to identify the most impactful area for improvement or the next logical step in their financial journey. Frame your advice in a positive and easy-to-understand way.`,
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
