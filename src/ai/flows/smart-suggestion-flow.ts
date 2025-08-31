
'use server';

/**
 * @fileOverview An AI flow to provide smart suggestions for reminders.
 *
 * - getSmartSuggestion - A function that analyzes user input and transaction history
 *   to suggest a category and amount for a new reminder.
 * - SmartSuggestionInput - The input type for the getSmartSuggestion function.
 * - SmartSuggestionOutput - The return type for the getSmartSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { expenseCategories } from '@/lib/categories';
import type { Transaction } from '@/lib/types';


const SmartSuggestionInputSchema = z.object({
  title: z.string().describe('The title or description of the reminder being created.'),
  transactions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['income', 'expense']),
      category: z.string(),
      amount: z.number(),
      date: z.string(),
      description: z.string(),
    })
  ).describe('A list of the user\'s past transactions.'),
});
export type SmartSuggestionInput = z.infer<typeof SmartSuggestionInputSchema>;


const SmartSuggestionOutputSchema = z.object({
  category: z.string().optional().describe('The suggested expense category for this reminder.'),
  amount: z.number().optional().describe('The suggested amount for this reminder based on historical data.'),
});
export type SmartSuggestionOutput = z.infer<typeof SmartSuggestionOutputSchema>;

export async function getSmartSuggestion(input: SmartSuggestionInput): Promise<SmartSuggestionOutput> {
  return smartSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSuggestionPrompt',
  input: { schema: SmartSuggestionInputSchema },
  output: { schema: SmartSuggestionOutputSchema },
  prompt: `
    You are an intelligent financial assistant. Your goal is to help users set reminders for their expenses by suggesting a category and amount based on a title they provide and their transaction history.

    Analyze the user's reminder title: "{{title}}"

    And their transaction history:
    {{#each transactions}}
    - {{this.description}} ({{this.category}}): {{this.amount}} on {{this.date}}
    {{/each}}
    
    Based on the title, find similar transactions in the history.
    - If you find a matching transaction, suggest its category and amount.
    - If there are multiple similar transactions, suggest the category and the most recent amount.
    - The category you suggest MUST be one of the following valid categories: {{jsonStringify expenseCategories}}.
    - Do not suggest a category if you cannot find a confident match from the provided list.
    - Only suggest a category and amount. Do not add any other commentary.
  `,
  // Add the list of valid categories to the prompt context
  context: {
    expenseCategories: expenseCategories.map(c => c.value),
  }
});


const smartSuggestionFlow = ai.defineFlow(
  {
    name: 'smartSuggestionFlow',
    inputSchema: SmartSuggestionInputSchema,
    outputSchema: SmartSuggestionOutputSchema,
  },
  async (input) => {
    // Prevent calling the AI if the title is too short to be meaningful
    if (input.title.length < 3) {
      return {};
    }

    const { output } = await prompt(input);
    return output!;
  }
);
