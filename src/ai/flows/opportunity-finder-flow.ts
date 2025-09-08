
'use server';

/**
 * @fileOverview An AI flow to generate financial opportunities for users.
 *
 * - getFinancialOpportunities - A function that analyzes user transaction history
 *   to suggest savings opportunities, income boosts, and negotiation tactics.
 * - FinancialOpportunitiesInput - The input type for the getFinancialOpportunities function.
 * - FinancialOpportunitiesOutput - The return type for the getFinancialOpportunities function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FinancialOpportunitiesInputSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['income', 'expense']),
      category: z.string(),
      amount: z.number(),
      date: z.string(),
      description: z.string(),
    })
  ).describe("A list of the user's recent transactions over the last 2-3 months."),
});
export type FinancialOpportunitiesInput = z.infer<typeof FinancialOpportunitiesInputSchema>;

const FinancialOpportunitySchema = z.object({
    type: z.enum(['savings', 'income', 'negotiation']).describe("The type of opportunity."),
    title: z.string().describe("A short, catchy title for the opportunity."),
    description: z.string().describe("A 2-3 sentence, actionable description of the opportunity, written in a friendly and encouraging tone. Use plain text with newlines for paragraphs."),
    action: z.string().optional().describe("A short call-to-action label for a button, like 'See Details' or 'Invite Friends'."),
});
export type FinancialOpportunity = z.infer<typeof FinancialOpportunitySchema>;


const FinancialOpportunitiesOutputSchema = z.object({
    opportunities: z.array(FinancialOpportunitySchema).describe("A list of 2-3 diverse and actionable financial opportunities."),
});
export type FinancialOpportunitiesOutput = z.infer<typeof FinancialOpportunitiesOutputSchema>;

export async function getFinancialOpportunities(input: FinancialOpportunitiesInput): Promise<FinancialOpportunitiesOutput> {
  return opportunityFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'opportunityFinderPrompt',
  input: { schema: FinancialOpportunitiesInputSchema },
  output: { schema: FinancialOpportunitiesOutputSchema },
  prompt: `
    You are a creative and practical Filipino financial coach. Your goal is to help users improve their financial health by finding actionable opportunities to save money, earn more, and reduce their bills. You need to be encouraging and avoid being judgmental.

    Analyze the user's transaction history below. Based on their spending and income patterns, generate 2-3 diverse and highly relevant financial opportunities for them.
    
    For each opportunity:
    1.  **Type**: Choose 'savings', 'income', or 'negotiation'.
    2.  **Title**: Create a short, engaging title.
    3.  **Description**: Write a friendly, 2-3 sentence description explaining the opportunity and how it helps. Be specific if possible (e.g., mention a specific spending category).
    4.  **Action**: Provide a short, motivating call-to-action for a button if applicable.

    Here are some ideas for inspiration:
    -   **Savings**: Identify a high-spending, non-essential category (like 'Shopping' or 'Entertainment') and suggest a small, achievable reduction. Frame it positively (e.g., "Unlock ₱500 extra this month!").
    -   **Income**: If the user's income seems low or their expenses are high, suggest they invite friends to the app to earn extra money by helping the community grow. Frame this as a core feature of the app for earning. Give it an action of "Invite Friends".
    -   **Negotiation**: If you see recurring bills (like utilities), suggest they negotiate a better rate. You can even offer to help generate a script.

    Prioritize opportunities that are most relevant to the user's data. If there isn't much data, provide more general but still helpful advice.

    User's Transaction History:
    {{#each transactions}}
      - {{this.description}} ({{this.category}}): {{this.amount}} on {{this.date}}
    {{/each}}
  `,
});


const opportunityFinderFlow = ai.defineFlow(
  {
    name: 'opportunityFinderFlow',
    inputSchema: FinancialOpportunitiesInputSchema,
    outputSchema: FinancialOpportunitiesOutputSchema,
  },
  async (input) => {
    // Only consider transactions from the last 90 days for relevance.
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentTransactions = input.transactions.filter(t => 
        new Date(t.date) > threeMonthsAgo
    );
    
    // Require a minimum number of transactions to generate meaningful advice.
    if (recentTransactions.length < 5) {
        return { opportunities: [] };
    }

    const { output } = await prompt({ transactions: recentTransactions });
    return output!;
  }
);
