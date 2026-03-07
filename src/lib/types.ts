export interface Character {
	name: string;
	role: string;
	description: string;
	glow: 'teal' | 'violet';
	trait: { label: string; value: number };
	flaw: { label: string; value: number };
}
