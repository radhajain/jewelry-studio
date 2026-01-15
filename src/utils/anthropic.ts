import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const MaterialSuggestionSchema = z.object({
	metals: z.array(z.string()).min(1).max(3),
	gemstones: z.array(z.string()).min(1).max(10),
	reasoning: z.string(),
});
export type MaterialSuggestion = z.infer<typeof MaterialSuggestionSchema>;

export async function suggestMaterials(
	name: string,
	description: string,
	moodKeywords: string[]
): Promise<MaterialSuggestion> {
	const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

	if (!apiKey) {
		throw new Error(
			'Anthropic API key not configured. Please set REACT_APP_ANTHROPIC_API_KEY in your .env file.'
		);
	}

	const client = new Anthropic({
		apiKey: apiKey,
		dangerouslyAllowBrowser: true, // Note: In production, this should be done server-side
	});

	const systemPrompt = `You are an expert jewelry designer. Based on the following collection information, suggest appropriate metals and gemstones.
  Please suggest:
1. Which metals would work best (1-3 metals from the available list)
2. Which gemstones would complement the design (1-4 gemstones from the available list)
3. Brief reasoning for your suggestions`;

	const userPrompt = `
Collection Name: ${name}
Description: ${description}
Mood Keywords: ${moodKeywords.join(', ')}

Available Metals: yellow-gold, white-gold, rose-gold, platinum, silver
Available Gemstones: diamond, sapphire, ruby, emerald, amethyst, topaz, pearl, opal, garnet, aquamarine
`;

	try {
		const message = await client.beta.messages.parse({
			model: 'claude-sonnet-4-5',
			max_tokens: 1024,
			system: systemPrompt,
			betas: ['structured-outputs-2025-11-13'],
			messages: [
				{
					role: 'user',
					content: userPrompt,
				},
			],
			output_format: betaZodOutputFormat(MaterialSuggestionSchema),
		});

		const response = message.parsed_output;
		if (!response) {
			throw new Error('Failed to parse response from Anthropic API');
		}

		return response;
	} catch (error) {
		console.error('Error calling Anthropic API:', error);
		throw error;
	}
}
