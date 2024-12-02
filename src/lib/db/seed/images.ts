export const initialStyles = [
  {
    name: "Modern Minimalist",
    description: "Clean lines, minimal furniture, and neutral colors create a sleek, contemporary space",
    category: "minimalist",
    promptTemplate: "modern minimalist interior design, clean lines, neutral colors, minimal furniture, {room_type}, natural light, architectural details, sleek finishes, uncluttered space, high-end design, photorealistic",
    negativePrompt: "cluttered, ornate, traditional, rustic, colorful patterns, vintage, text, watermark, busy design",
    controlnetPreprocessor: "canny",
    controlnetModel: "control_v11p_sd15_canny",
    controlnetWeight: "0.8",
    thumbnailUrl: "/styles/modern-minimalist.jpg"
  },
  {
    name: "Industrial Loft",
    description: "Raw materials, exposed structures, and urban elements for a sophisticated industrial feel",
    category: "industrial",
    promptTemplate: "industrial loft interior design, exposed brick walls, concrete floors, metal fixtures, {room_type}, high ceilings, large windows, urban style, raw materials, industrial lighting, modern furniture, photorealistic",
    negativePrompt: "traditional, ornate, rustic, floral patterns, text, watermark, classical design",
    controlnetPreprocessor: "canny",
    controlnetModel: "control_v11p_sd15_canny",
    controlnetWeight: "0.8",
    thumbnailUrl: "/styles/industrial-loft.jpg"
  },
  {
    name: "Scandinavian",
    description: "Light woods, white spaces, and functional design for a cozy Nordic atmosphere",
    category: "scandinavian",
    promptTemplate: "scandinavian interior design, light wood furniture, white walls, {room_type}, natural materials, hygge, functional design, cozy textiles, minimalist decor, soft textures, photorealistic",
    negativePrompt: "dark colors, heavy furniture, ornate details, cluttered space, text, watermark, baroque style",
    controlnetPreprocessor: "canny",
    controlnetModel: "control_v11p_sd15_canny",
    controlnetWeight: "0.8",
    thumbnailUrl: "/styles/scandinavian.jpg"
  },
  {
    name: "Luxury Classic",
    description: "Elegant details, rich materials, and traditional elements for a timeless luxury feel",
    category: "traditional",
    promptTemplate: "luxury classic interior design, elegant furniture, crystal chandelier, {room_type}, rich fabrics, marble floors, detailed moldings, sophisticated decor, high-end finishes, traditional design, photorealistic",
    negativePrompt: "minimalist, industrial, modern, simple design, text, watermark, cluttered",
    controlnetPreprocessor: "canny",
    controlnetModel: "control_v11p_sd15_canny",
    controlnetWeight: "0.8",
    thumbnailUrl: "/styles/luxury-classic.jpg"
  },
  {
    name: "Coastal Modern",
    description: "Beach-inspired colors, natural light, and relaxed furniture for a contemporary coastal vibe",
    category: "coastal",
    promptTemplate: "coastal modern interior design, beach-inspired colors, light airy space, {room_type}, natural textures, white furniture, ocean-inspired decor, relaxed atmosphere, contemporary coastal style, photorealistic",
    negativePrompt: "dark colors, heavy furniture, urban style, text, watermark, industrial elements",
    controlnetPreprocessor: "canny",
    controlnetModel: "control_v11p_sd15_canny",
    controlnetWeight: "0.8",
    thumbnailUrl: "/styles/coastal-modern.jpg"
  }
];