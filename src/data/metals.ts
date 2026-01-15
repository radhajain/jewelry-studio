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
		hexStart: '#ECC440',
		hexEnd: '#DDAC17',
		imageUrl:
			'https://images.unsplash.com/photo-1656055448515-41d4b1163f4c?q=80&w=2070',
	},
	{
		id: 'silver',
		name: 'Silver',
		hexStart: '#FFFA8A',
		hexEnd: '#FFFF95',
		imageUrl:
			'https://images.unsplash.com/photo-1656055448515-41d4b1163f4c?q=80&w=2070',
	},
	{
		id: 'white-gold',
		name: 'White Gold',
		hexStart: '#FFFF4',
		hexEnd: '#FFFF95',
		imageUrl:
			'https://images.unsplash.com/photo-1656055448515-41d4b1163f4c?q=80&w=2070',
	},
];
