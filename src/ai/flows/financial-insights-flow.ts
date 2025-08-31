
'use server';
/**
 * @fileOverview An AI flow for generating financial insights from transactions.
 *
 * - getFinancialInsights - A function that analyzes transactions.
 * - FinancialInsightsInput - The input type for the getFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import { ai } from '@/ai/genkit';
import type { Transaction } from '@/lib/types';
import { z } from 'genkit';

const TransactionSchema = z.object({
  id: z.string(),
  type: z.enum(['income', 'expense']),
  category: z.string(),
  amount: z.number(),
  date: z.string(),
  description: z.string(),
});

const FinancialInsightsInputSchema = z.object({
  transactions: z.array(TransactionSchema),
  currency: z.string(),
});
export type FinancialInsightsInput = z.infer<
  typeof FinancialInsightsInputSchema
>;

const FinancialInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      insight: z.string().describe('The single, concise financial insight or tip.'),
      type: z
        .enum(['positive', 'negative', 'neutral'])
        .describe(
          'The sentiment of the insight. Positive for good habits, negative for areas of improvement, neutral for observations.'
        ),
      category: z.string().describe('The most relevant spending category for this insight, e.g. "Entertainment", "Savings", or "Income".')
    })
  ).describe('A list of 2-3 personalized financial insights.'),
});
export type FinancialInsightsOutput = z.infer<
  typeof FinancialInsightsOutputSchema
>;

export async function getFinancialInsights(
  input: FinancialInsightsInput
): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: { schema: FinancialInsightsInputSchema },
  output: { schema: FinancialInsightsOutputSchema },
  prompt: `You are a helpful and friendly financial assistant. Your goal is to analyze a user's transaction history and provide them with 2-3 clear, actionable, and personalized insights to help them improve their financial health.

Analyze the following list of transactions for the user. The currency is {{currency}}.

Transactions:
{{#each transactions}}
- {{type}} of {{amount}} on {{date}} for "{{description}}" (Category: {{category}})
{{/each}}

Based on this data, identify notable spending patterns, potential savings, or areas of concern.
Generate insights that are easy to understand. Frame them as helpful tips or observations.

For each insight, determine if it is 'positive' (e.g., good savings), 'negative' (e.g., overspending), or 'neutral' (e.g., an observation). Also, specify the most relevant financial category.
`,
});

const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async (input) => {
    // Do not call on the server if there are no transactions
    if (input.transactions.length === 0) {
        return { insights: [] };
    }

    const { output } = await prompt(input);
    return output!;
  }
);
