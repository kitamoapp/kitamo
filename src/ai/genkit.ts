'use client';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins = [];
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
}

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.5-flash',
});
