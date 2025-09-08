
'use server';

/**
 * @fileOverview An AI flow to assess loan risk and provide advice on building an emergency fund.
 *
 * - getLoanRiskAdvice - A function that analyzes a user's financial situation to provide
 *   advice on avoiding loans and building an emergency fund.
 * - LoanRiskAdviceInput - The input type for the getLoanRiskAdvice function.
 * - LoanRiskAdviceOutput - The return type for the getLoanRiskAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Transaction, Reminder } from '@/lib/types';
import { subMonths, differenceInDays } from 'date-fns';

const LoanRiskAdviceInputSchema = z.object({
  transactions: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['income', 'expense']),
        category: z.string(),
        amount: z.number(),
        date: z.string(),
        description: z.string(),
      })
    )
    .describe("A list of the user's recent transactions over the last 3 months."),
  reminders: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        amount: z.number(),
        category: z.string(),
        date: z.string(),
        recurrence: z.enum(['none', 'daily', 'weekly', 'monthly']),
      })
    )
    .describe('A list of upcoming scheduled payments and bills.'),
  customEmergencyFundTarget: z.number().optional().describe("The user's self-defined emergency fund goal."),
});
export type LoanRiskAdviceInput = z.infer<typeof LoanRiskAdviceInputSchema>;

const LoanRiskAdviceOutputSchema = z.object({
  status: z
    .enum(['onTrack', 'atRisk', 'noData'])
    .describe(
      "The user's current financial status regarding their emergency fund and loan risk."
    ),
  advice: z
    .string()
    .describe('A concise, actionable piece of advice for the user.'),
  recommendedEmergencyFundTarget: z
    .number()
    .describe('The AI-recommended emergency fund goal (e.g., 3 months of expenses).'),
  currentEmergencyFund: z
    .number()
    .describe('The user\'s current savings that can be considered an emergency fund (current balance).'),
});
export type LoanRiskAdviceOutput = z.infer<typeof LoanRiskAdviceOutputSchema>;

export async function getLoanRiskAdvice(
  input: LoanRiskAdviceInput
): Promise<LoanRiskAdviceOutput> {
  return loanAdvisorFlow(input);
}

const calculateFinancials = (transactions: Transaction[]) => {
    const threeMonthsAgo = subMonths(new Date(), 3);
    const recentTransactions = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);

    const totalDays = differenceInDays(new Date(), threeMonthsAgo) || 90;
    const totalMonths = totalDays / 30.5;


    const totalIncome = recentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = recentTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const averageMonthlyIncome = totalMonths > 0 ? totalIncome / totalMonths : 0;
    const averageMonthlyExpenses = totalMonths > 0 ? totalExpenses / totalMonths : 0;

    return { balance, averageMonthlyExpenses, averageMonthlyIncome, hasEnoughData: recentTransactions.length > 5 };
}

const prompt = ai.definePrompt({
  name: 'loanAdvisorPrompt',
  input: { schema: LoanRiskAdviceInputSchema.extend({ averageMonthlyExpenses: z.number(), balance: z.number() }) },
  output: { schema: z.object({ status: z.enum(['onTrack', 'atRisk']), advice: z.string() }) },
  prompt: `
    You are a caring and practical Filipino financial advisor. Your goal is to help users avoid taking on debt by building an emergency fund and managing their cash flow wisely.

    Here is the user's financial situation:
    - Average Monthly Expenses: {{averageMonthlyExpenses}}
    - Current Balance (Savings): {{balance}}
    {{#if customEmergencyFundTarget}}
    - User's Custom Savings Goal: {{customEmergencyFundTarget}}
    {{/if}}
    - Upcoming Bills:
    {{#each reminders}}
      - {{this.title}} for {{this.amount}} on {{this.date}}
    {{/each}}
    - Recent Transactions:
    {{#each transactions}}
      - {{this.type}} of {{this.amount}} for {{this.description}} on {{this.date}}
    {{/each}}

    Analyze their situation.
    1.  If their average expenses are higher than their average income, or if a large upcoming bill might cause their balance to go negative, they are 'atRisk'.
    2.  Otherwise, they are 'onTrack'.

    Based on their status, provide a single, actionable sentence of advice in a supportive tone.
    - If 'atRisk', give a specific, gentle warning and a suggestion. Example: "Your spending has been a bit high lately. Try to cut back on 'Shopping' to stay on track and avoid needing to borrow."
    - If 'onTrack' and they have a custom goal, encourage them towards it. Example: "You're doing great! Keep saving consistently to reach your ₱{{customEmergencyFundTarget}} goal."
    - If 'onTrack' and no custom goal, provide general encouragement. Example: "Great job managing your finances! Keep building your savings to stay prepared for anything."
  `,
});


const loanAdvisorFlow = ai.defineFlow(
  {
    name: 'loanAdvisorFlow',
    inputSchema: LoanRiskAdviceInputSchema,
    outputSchema: LoanRiskAdviceOutputSchema,
  },
  async (input) => {
    const { balance, averageMonthlyExpenses, hasEnoughData } = calculateFinancials(input.transactions);
    
    const recommendedEmergencyFundTarget = Math.max(averageMonthlyExpenses, 5000); // Target is 1 month of expenses, or a minimum of 5000.

    if (!hasEnoughData) {
        return {
            status: 'noData',
            advice: "Track your spending for a while and I'll help you build an emergency fund to stay financially secure.",
            recommendedEmergencyFundTarget,
            currentEmergencyFund: balance > 0 ? balance : 0
        };
    }

    const { output } = await prompt({ ...input, averageMonthlyExpenses, balance });
    
    return {
        ...output!,
        recommendedEmergencyFundTarget,
        currentEmergencyFund: balance > 0 ? balance : 0,
    };
  }
);
