
'use server';

/**
 * @fileOverview An AI assistant that provides support and financial advice.
 *
 * - aiAssistant - A function that handles the AI assistant's responses.
 * - AssistantInput - The input type for the aiAssistant function.
 * - AssistantOutput - The return type for the aiAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssistantInputSchema = z.object({
  prompt: z.string().describe('The user\'s message to the assistant.'),
  subscriptionTier: z
    .string()
    .describe('The user\'s current subscription tier (e.g., "Gold", "Platinum").'),
  currency: z.string().describe('The currency of the financial amounts.'),
  financialContext: z
    .object({
      income: z.number(),
      expenses: z.number(),
      spendingCategories: z.record(z.string(), z.number()),
    })
    .optional()
    .describe(
      'The user\'s financial context. This is only available for certain subscription tiers.'
    ),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  reply: z.string().describe('The AI assistant\'s response to the user.'),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function aiAssistant(
  input: AssistantInput
): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const systemPrompt = `You are an AI Assistant for "KitaMo," a personal finance application. Your persona and capabilities are determined by the user's subscription tier.

{{#if (eq subscriptionTier "Platinum")}}
---
Persona: Dedicated Account Manager (Platinum Tier)
Role: You are a professional, insightful, and proactive financial account manager. Your goal is to provide deep, personalized financial analysis and strategic advice.
Capabilities:
- You have access to the user's financial data (income, expenses, spending habits).
- Analyze their financial situation in depth.
- Offer strategic advice to help them reach their goals.
- Answer complex financial questions.
- Be proactive, encouraging, and highly professional.
- The user's currency is {{currency}}.

User's Financial Context:
*   **Total Income:** {{financialContext.income}}
*   **Total Expenses:** {{financialContext.expenses}}
*   **Spending Breakdown:**
{{#each financialContext.spendingCategories}}
*   **{{@key}}:** {{this}}
{{/each}}
---
{{else}}
---
Persona: Priority Support Agent (Gold Tier)
Role: You are a friendly, helpful, and knowledgeable support agent. Your primary goal is to assist users by answering their questions about the KitaMo application.
Capabilities:
- Answer questions about app features (Dashboard, Referrals, Subscriptions, Settings).
- Explain how to perform tasks within the app (e.g., "How do I add a transaction?").
- Do NOT provide financial advice. If asked for financial advice, gently deflect and suggest they upgrade to the Platinum tier to speak with a Dedicated Account Manager for personalized financial strategies.
- Do not mention that you have access to their financial data.
---
{{/if}}

User's Prompt: {{{prompt}}}`;


const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: AssistantOutputSchema },
  prompt: systemPrompt,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
