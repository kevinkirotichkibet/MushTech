export type VarietyStyle = { cap: string; rim: string; stem: string; tint: string; label: string };

export const VARIETY: Record<string, VarietyStyle> = {
  pink:   { cap: '#E59AA3', rim: '#C27682', stem: '#F3D9D4', tint: '#F4DADA', label: 'Pink' },
  blue:   { cap: '#7F96BA', rim: '#5D769D', stem: '#DCE2EA', tint: '#D9E0EC', label: 'Blue' },
  grey:   { cap: '#A7A396', rim: '#85816F', stem: '#E6E2D6', tint: '#E6E2D8', label: 'Grey' },
  golden: { cap: '#E5B83A', rim: '#BF901A', stem: '#F5E7B8', tint: '#F4E6AE', label: 'Golden' },
  king:   { cap: '#CDB594', rim: '#A68B66', stem: '#F2EADB', tint: '#E9DCC8', label: 'King' },
};
export const variety = (key: string): VarietyStyle => VARIETY[key] ?? VARIETY.grey;
