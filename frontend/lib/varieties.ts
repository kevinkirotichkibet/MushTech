export type VarietyStyle = { tint: string; label: string };

export const VARIETY: Record<string, VarietyStyle> = {
  oyster: { tint: '#E9E0CC', label: 'Oyster' },
  button: { tint: '#EFE5D3', label: 'Button' },
  pink:   { tint: '#F4DADA', label: 'Pink oyster' },
  blue:   { tint: '#D9E0EC', label: 'Blue oyster' },
  grey:   { tint: '#E6E2D8', label: 'Grey oyster' },
  golden: { tint: '#F4E6AE', label: 'Golden oyster' },
  king:   { tint: '#E9DCC8', label: 'King oyster' },
};
export const variety = (key: string): VarietyStyle => VARIETY[key] ?? { tint: '#E9E0CC', label: 'Mushroom' };
