
'use server';

/**
 * @fileOverview An AI flow to generate financial insights based on transaction history.
 *
 * - getFinancialInsights - A function that analyzes user transaction history
 *   to provide actionable financial advice.
 * - FinancialInsightsInput - The input type for the getFinancialInsights function.
 * - FinancialInsightsOutput - The return type for the getFinancialInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Transaction } from '@/lib/types';

const FinancialInsightsInputSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['income', 'expense']),
      category: z.string(),
      amount: z.number(),
      date: z.string(),
      description: z.string(),
    })
  ).describe("A list of the user's recent transactions."),
});
export type FinancialInsightsInput = z.infer<typeof FinancialInsightsInputSchema>;


const FinancialInsightsOutputSchema = z.object({
  insights: z.string().describe('A concise, actionable analysis of the user\'s spending habits with tips for improvement. The response should be formatted as plain text with paragraphs separated by newlines.'),
});
export type FinancialInsightsOutput = z.infer<typeof FinancialInsightsOutputSchema>;

export async function getFinancialInsights(input: FinancialInsightsInput): Promise<FinancialInsightsOutput> {
  return financialInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialInsightsPrompt',
  input: { schema: FinancialInsightsInputSchema },
  output: { schema: FinancialInsightsOutputSchema },
  prompt: `
    You are a friendly and encouraging financial assistant. Your goal is to analyze a user's recent transaction history and provide 2-3 clear, actionable insights to help them improve their financial health.

    Analyze the user's transaction history:
    {{#each transactions}}
    - {{this.description}} ({{this.category}}): {{this.amount}} on {{formatDate this.date "yyyy-MM-dd"}}
    {{/each}}
    
    Based on this data, provide a short, easy-to-read summary. Your analysis should:
    1.  Start with a positive and encouraging sentence.
    2.  Identify the top 1-2 spending categories.
    3.  Point out any spending trends or significant one-off expenses.
    4.  Offer a simple, actionable tip for saving money or improving their budget based on their specific spending.
    5.  Keep the tone light and supportive, not judgmental.
    6.  The entire response should be 2-4 sentences long. Do not use markdown, bullet points, or numbered lists.
  `,
});


const financialInsightsFlow = ai.defineFlow(
  {
    name: 'financialInsightsFlow',
    inputSchema: FinancialInsightsInputSchema,
    outputSchema: FinancialInsightsOutputSchema,
  },
  async (input) => {
    // Ensure we only look at recent transactions to keep insights relevant
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentTransactions = input.transactions.filter(t => new Date(t.date) > oneMonthAgo);

    if (recentTransactions.length < 3) {
      return { insights: "You don't have enough recent transaction data to analyze. Keep tracking to get your insights!" };
    }

    const { output } = await prompt({ transactions: recentTransactions });
    return output!;
  }
);
