
'use server';

/**
 * @fileOverview An AI flow to generate a personalized budget based on transaction history.
 *
 * - createBudget - A function that analyzes user transaction history
 *   to suggest monthly budget allocations.
 * - CreateBudgetInput - The input type for the createBudget function.
 * - CreateBudgetOutput - The return type for the createBudget function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Transaction } from '@/lib/types';
import { expenseCategories } from '@/lib/categories';

const CreateBudgetInputSchema = z.object({
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
export type CreateBudgetInput = z.infer<typeof CreateBudgetInputSchema>;


const CreateBudgetOutputSchema = z.object({
    budget: z.array(z.object({
        category: z.string().describe('The expense category.'),
        amount: z.number().describe('The suggested monthly budget for this category, rounded to a whole number.'),
    })).describe('A list of suggested budget allocations for various expense categories.')
});
export type CreateBudgetOutput = z.infer<typeof CreateBudgetOutputSchema>;

export async function createBudget(input: CreateBudgetInput): Promise<CreateBudgetOutput> {
  return createBudgetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createBudgetPrompt',
  input: { schema: CreateBudgetInputSchema },
  output: { schema: CreateBudgetOutputSchema },
  prompt: `
    You are a pragmatic financial advisor. Your task is to create a realistic monthly budget for a user based on their transaction history.

    Analyze the user's transaction history provided below.
    - Focus only on 'expense' transactions.
    - Calculate the average monthly spending for each category.
    - Set a budget for each category that is slightly lower than their average spending to encourage savings, but not so low that it's unrealistic. Round the budget amount to a sensible whole number.
    - Only generate budgets for categories where the user has existing spending.
    - The budget categories you provide MUST be from this list: {{jsonStringify expenseCategories}}.

    User's Transaction History:
    {{#each transactions}}
      {{#if (eq this.type "expense")}}
      - {{this.description}} ({{this.category}}): {{this.amount}} on {{this.date}}
      {{/if}}
    {{/each}}
  `,
  context: {
    expenseCategories: expenseCategories.map(c => c.value),
  }
});


const createBudgetFlow = ai.defineFlow(
  {
    name: 'createBudgetFlow',
    inputSchema: CreateBudgetInputSchema,
    outputSchema: CreateBudgetOutputSchema,
  },
  async (input) => {
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentExpenses = input.transactions.filter(t => 
        t.type === 'expense' && new Date(t.date) > threeMonthsAgo
    );

    if (recentExpenses.length < 5) {
      // Not enough data to generate a meaningful budget
      return { budget: [] };
    }

    const { output } = await prompt({ transactions: recentExpenses });
    return output!;
  }
);

    