export const STYLE_CATEGORIES = [
  'Modern',
  'Contemporary',
  'Traditional',
  'Industrial',
  'Minimalist',
  'Scandinavian',
  'Mid-Century Modern',
  'Bohemian',
] as const;

export type StyleCategory = typeof STYLE_CATEGORIES[number];

export interface Style {
  id: string;
  name: string;
  description: string;
  category: StyleCategory;
  promptModifier: string;
  negativePrompt: string;
  thumbnailUrl?: string;
}

export const PRESET_STYLES: Style[] = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    category: 'Modern',
    description: 'Clean lines, minimal decoration, and functional spaces with a focus on simplicity.',
    promptModifier: 'modern minimalist interior design, clean lines, uncluttered space, neutral colors, functional furniture, natural light, zen atmosphere',
    negativePrompt: 'cluttered, ornate, traditional, vintage, excessive decoration, dark spaces',
  },
  {
    id: 'industrial-loft',
    name: 'Industrial Loft',
    category: 'Industrial',
    description: 'Raw materials, exposed structures, and urban aesthetics.',
    promptModifier: 'industrial loft interior, exposed brick walls, metal fixtures, high ceilings, raw concrete, Edison bulbs, urban style',
    negativePrompt: 'traditional furniture, floral patterns, pastel colors, country style',
  },
  {
    id: 'scandinavian-comfort',
    name: 'Scandinavian Comfort',
    category: 'Scandinavian',
    description: 'Light, airy spaces with natural materials and comfortable minimalism.',
    promptModifier: 'Scandinavian interior design, light wood, white walls, hygge, cozy minimalism, natural textures, soft textiles',
    negativePrompt: 'dark colors, heavy furniture, ornate decoration, cluttered space',
  },
  {
    id: 'luxury-modern',
    name: 'Modern Luxury',
    category: 'Contemporary',
    description: 'High-end contemporary design with luxurious materials and bold statements.',
    promptModifier: 'luxury modern interior, high-end finishes, marble surfaces, designer furniture, sophisticated lighting, elegant materials',
    negativePrompt: 'rustic elements, worn furniture, casual setting, budget furniture',
  },
  {
    id: 'japanese-zen',
    name: 'Japanese Zen',
    category: 'Minimalist',
    description: 'Peaceful, minimalist spaces inspired by Japanese design principles.',
    promptModifier: 'Japanese zen interior, tatami mats, shoji screens, minimalist furniture, bamboo elements, peaceful atmosphere',
    negativePrompt: 'busy patterns, western furniture, cluttered space, bright colors',
  }
];