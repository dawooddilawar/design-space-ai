// scripts/seed-styles.ts
import { db } from '@/lib/db';
import { styles } from '@/lib/db/schema';
import { PRESET_STYLES } from '@/lib/styles/constants';

async function seed() {
  try {
    console.log('Seeding styles...');

    // Insert all preset styles
    await db.insert(styles).values(PRESET_STYLES.map(style => ({
      id: style.id,
      name: style.name,
      description: style.description,
      category: style.category,
      thumbnailUrl: style.thumbnailUrl,
      isActive: true
    }))).onConflictDoNothing();

    console.log('Styles seeded successfully!');
  } catch (error) {
    console.error('Error seeding styles:', error);
    process.exit(1);
  }
}

seed();