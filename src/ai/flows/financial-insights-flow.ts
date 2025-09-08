
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
  insights: z.string().describe('A concise, consultative analysis of the user\'s spending habits with strategic advice for improvement. The response should be formatted as plain text with paragraphs separated by newlines.'),
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
    You are a professional financial consultant providing a premium, personalized consultation. Your goal is to analyze a user's recent transaction history and provide 2-3 clear, strategic insights to help them improve their financial health.

    Analyze the user's transaction data:
    {{#each transactions}}
    - {{this.description}} ({{this.category}}): {{this.amount}} on {{this.date}}
    {{/each}}
    
    Based on this data, provide a short, consultative summary. Your analysis should:
    1.  Start with an encouraging, professional opening.
    2.  Identify the top 1-2 spending categories and frame them as key drivers of their financial picture.
    3.  Point out any significant spending trends or outliers.
    4.  Offer a simple, actionable piece of strategic advice for optimizing their budget or cash flow.
    5.  Maintain a supportive, expert tone. Avoid being judgmental.
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
      return { insights: "You don't have enough recent transaction data for an analysis. Keep tracking your finances to unlock AI-powered insights!" };
    }

    const { output } = await prompt({ transactions: recentTransactions });
    return output!;
  }
);
