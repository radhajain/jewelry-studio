import { JewelryPiece } from './piece';

export interface Collection {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;

	// Theme & Style
	theme: CollectionTheme;
	moodboard: MoodboardImage[];

	// Design Parameters (Global Stylesheet)
	colors: ColorPalette;
	gemstones: Gemstone[];
	bezelDesigns: BezelDesign[];

	// Pieces in this collection
	pieces: JewelryPiece[];
}

export interface CollectionTheme {
	primaryColor: string;
	secondaryColor: string;
	accentColor: string;
	mood: string[]; // e.g., ['elegant', 'bold', 'delicate']
}

export interface MoodboardImage {
	id: string;
	url: string; // data URL or local path
	thumbnail: string;
	uploadedAt: string;
	description?: string;
}

export interface ColorPalette {
	metals: MetalColor[];
	accents: string[]; // Hex colors
}

export type MetalColor =
	| 'yellow-gold'
	| 'white-gold'
	| 'rose-gold'
	| 'platinum'
	| 'silver';

export interface Gemstone {
	id: string;
	name: string;
	color: string;
	shape: GemstoneShape;
	caratRange: { min: number; max: number };
}

export type GemstoneShape =
	| 'round'
	| 'princess'
	| 'emerald'
	| 'oval'
	| 'pear'
	| 'marquise'
	| 'cushion'
	| 'heart';

export interface BezelDesign {
	id: string;
	name: string;
	style: 'prong' | 'bezel' | 'pave' | 'channel' | 'tension';
	illustration: string; // SVG or image URL
}
