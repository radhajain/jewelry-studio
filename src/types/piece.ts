import { MetalColor } from '../data/metals';

export interface JewelryPiece {
	id: string;
	collectionId?: string; // Optional - pieces can be standalone
	name: string;
	type: PieceType;
	createdAt: string;
	updatedAt: string;

	// Design Choices (from quiz)
	design: PieceDesign;

	// Visualization
	render: PieceRender;

	// Status
	isComplete: boolean;
	completionPercentage: number;
}

export type PieceType = 'ring' | 'earring' | 'bracelet' | 'necklace';

export interface PieceDesign {
	// Core Design Elements
	metal: MetalColor;
	primaryGemstone?: GemstoneSelection;
	accentGemstones?: GemstoneSelection[];
	bezelStyle: string; // References BezelDesign.id

	// Type-specific attributes
	ringSize?: number;
	bandThickness?: 'thin' | 'medium' | 'thick';
	bandStyle?: BandStyle;

	// Earrings
	earringStyle?: 'stud' | 'hoop' | 'drop' | 'chandelier';

	// Necklace/Bracelet
	length?: number;
	chainStyle?: ChainStyle;
	braceletStyle?: BraceletStyle;

	// Additional customizations
	engraving?: string;
	finish?: 'polished' | 'matte' | 'hammered' | 'brushed';
}

export interface GemstoneSelection {
	gemstoneId: string; // References Gemstone.id from collection
	carats: number;
	position: 'center' | 'accent' | 'side';
	setting?: SettingStyle; // How the gemstone is mounted
	shapeOverride?: GemstoneShape; // Override the default shape from gemstone data
}

export type SettingStyle = 'prong' | 'bezel' | 'pave' | 'channel' | 'tension' | 'flush';
export type GemstoneShape = 'round' | 'oval' | 'princess' | 'emerald' | 'cushion' | 'pear' | 'marquise' | 'heart';

export type BandStyle = 'plain' | 'twisted' | 'braided' | 'textured' | 'split';
export type BraceletStyle = 'chain' | 'bangle' | 'cuff' | 'tennis' | 'charm';
export type ChainStyle =
	| 'cable'
	| 'rope'
	| 'box'
	| 'snake'
	| 'figaro'
	| 'wheat';

export interface PieceRender {
	type: '2D' | '3D';
	data: Render2D | Render3D;
}

export interface Render2D {
	layers: RenderLayer[];
	viewAngle: 'top' | 'side' | 'perspective';
}

export interface RenderLayer {
	id: string;
	type: 'base' | 'gemstone' | 'detail' | 'shadow';
	svgPath?: string;
	imageSrc?: string;
	transform: {
		x: number;
		y: number;
		scale: number;
		rotation: number;
	};
	style: {
		fill?: string;
		stroke?: string;
		strokeWidth?: number;
		opacity?: number;
	};
}

export interface Render3D {
	// Placeholder for future 3D integration
	modelUrl?: string;
	camera: { x: number; y: number; z: number };
	lights: unknown[];
}
