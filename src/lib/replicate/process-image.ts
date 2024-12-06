import Replicate from 'replicate';

import { env } from '@/lib/env';

import type { Style } from '../styles/constants';

const replicate = new Replicate({
  auth: env.REPLICATE_API_TOKEN,
});

export async function processImage(
  imageUrl: string,
  style: Style,
  controlnetStrength: number = 0.8,
  styleStrength: number = 0.7,
) {
  try {
    const output = await replicate.run(
      "black-forest-labs/flux-canny-pro",
      {
        input: {
          control_image: "https://i.ibb.co/2gT437t/klkpk2f3yw4e1.jpg",
          prompt: style.promptModifier,
          guidance: 25,
          num_inference_steps: 28,
          seed: Math.floor(Math.random() * 100000),
        }
      }
    );

    return output;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
}