import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';

const MaterialSuggestionSchema = z.object({
	metals: z.array(z.string()).min(1).max(3),
	gemstones: z.array(z.string()).min(1).max(10),
	reasoning: z.string(),
});
export type MaterialSuggestion = z.infer<typeof MaterialSuggestionSchema>;

// Schema for a single piece suggestion
const PieceSuggestionSchema = z.object({
	type: z.string(), // 'ring' | 'earring' | 'bracelet' | 'necklace'
	name: z.string(),
	description: z.string(),
	metal: z.string(),
	finish: z.string(), // 'polished' | 'matte' | 'hammered' | 'brushed'
	gemstoneId: z.string().nullable(),
	gemstoneShape: z.string().nullable(), // 'round' | 'oval' | etc.
	setting: z.string().nullable(), // 'prong' | 'bezel' | etc.
	// Type-specific
	bandStyle: z.string().nullable(), // 'plain' | 'twisted' | etc.
	bandThickness: z.string().nullable(), // 'thin' | 'medium' | 'thick'
	earringStyle: z.string().nullable(), // 'stud' | 'hoop' | etc.
	braceletStyle: z.string().nullable(), // 'chain' | 'bangle' | etc.
	chainStyle: z.string().nullable(), // 'cable' | 'rope' | etc.
	length: z.number().nullable(),
});

const PieceSuggestionsSchema = z.object({
	pieces: z.array(PieceSuggestionSchema),
});

export type PieceSuggestion = z.infer<typeof PieceSuggestionSchema>;
export type PieceSuggestionsResponse = z.infer<typeof PieceSuggestionsSchema>;

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

export async function suggestPieces(
	collectionName: string,
	collectionDescription: string,
	moodKeywords: string[],
	availableMetals: string[],
	availableGemstones: string[]
): Promise<PieceSuggestionsResponse> {
	const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

	if (!apiKey) {
		throw new Error(
			'Anthropic API key not configured. Please set REACT_APP_ANTHROPIC_API_KEY in your .env file.'
		);
	}

	const client = new Anthropic({
		apiKey: apiKey,
		dangerouslyAllowBrowser: true,
	});

	const systemPrompt = `You are an expert jewelry designer. Based on the collection information provided, suggest 4 unique jewelry pieces (one ring, one earring, one bracelet, and one necklace) that would fit perfectly in this collection.

For each piece, provide:
- A creative, evocative name that fits the collection theme
- A brief description explaining the design vision
- Appropriate design choices from the available options

Design Guidelines:
- Ring: Consider band style (plain, twisted, braided, textured, split) and thickness (thin, medium, thick)
- Earring: Choose a style (stud, hoop, drop, chandelier) that complements the mood
- Bracelet: Select a style (chain, bangle, cuff, tennis, charm) with appropriate length (6.5-8 inches for chain)
- Necklace: Pick a chain style (cable, rope, box, snake, figaro, wheat) and length (16-30 inches)

Gemstone settings (if used): prong, bezel, pave, channel, tension, flush
Gemstone shapes: round, oval, princess, emerald, cushion, pear, marquise, heart
Finishes: polished, matte, hammered, brushed

Make the suggestions cohesive with the collection's theme and mood while ensuring each piece is distinct and interesting.`;

	const userPrompt = `
Collection Name: ${collectionName}
Description: ${collectionDescription}
Mood Keywords: ${moodKeywords.join(', ')}

Available Metals: ${availableMetals.join(', ')}
Available Gemstones: ${availableGemstones.length > 0 ? availableGemstones.join(', ') : 'None specified (you may suggest pieces without gemstones or leave gemstoneId as null)'}

Please suggest 4 pieces (one of each type: ring, earring, bracelet, necklace) that would be perfect for this collection.
`;

	try {
		const message = await client.beta.messages.parse({
			model: 'claude-sonnet-4-5',
			max_tokens: 2048,
			system: systemPrompt,
			betas: ['structured-outputs-2025-11-13'],
			messages: [
				{
					role: 'user',
					content: userPrompt,
				},
			],
			output_format: betaZodOutputFormat(PieceSuggestionsSchema),
		});

		const response = message.parsed_output;
		if (!response) {
			throw new Error('Failed to parse response from Anthropic API');
		}

		return response;
	} catch (error) {
		console.error('Error calling Anthropic API for piece suggestions:', error);
		throw error;
	}
}
