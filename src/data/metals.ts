export const MetalColors = [
	'yellow-gold',
	'white-gold',
	'platinum',
	'silver',
] as const;
export type MetalColor = (typeof MetalColors)[number];

export interface Metal {
	id: MetalColor;
	name: string;
	imageUrl: string;
	hexStart: string;
	hexEnd: string;
}

export const metals = [
	{
		id: 'yellow-gold',
		name: 'Gold',
		hexStart: '#DFBD69',
		hexEnd: '#926F34',
		imageUrl:
			'https://images.unsplash.com/photo-1545873509-33e944ca7655?q=80&w=2073',
	},
	{
		id: 'platinum',
		name: 'Platinum',
		hexStart: '#E5E4E2',
		hexEnd: '#B0B3B0',
		imageUrl:
			'https://images.unsplash.com/photo-1656055448515-41d4b1163f4c?q=80&w=2070',
	},
	{
		id: 'silver',
		name: 'Silver',
		hexStart: '#BDC3C7',
		hexEnd: '#2C3E50',
		imageUrl:
			'https://images.unsplash.com/photo-1656055448515-41d4b1163f4c?q=80&w=2070',
	},
	{
		id: 'white-gold',
		name: 'White Gold',
		hexStart: '#F3E5AB',
		hexEnd: '#E1D9D1',
		imageUrl:
			'https://images.unsplash.com/photo-1656055448515-41d4b1163f4c?q=80&w=2070',
	},
];
