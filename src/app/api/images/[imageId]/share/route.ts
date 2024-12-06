export const runtime = 'nodejs'

import { nanoid } from 'nanoid';

export async function POST(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const authRequest = auth.handleRequest(request);
    const session = await authRequest.validate();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const image = await db.query.images.findFirst({
      where: eq(images.id, params.imageId),
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (image.userId !== session.user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique share token
    const shareToken = nanoid();

    // Store the share token in the database
    await db.update(images)
      .set({ shareToken })
      .where(eq(images.id, params.imageId))
      .execute();

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareToken}`;

    return NextResponse.json({ shareUrl });
  } catch (error) {
    console.error("Share error:", error);
    return NextResponse.json(
      { error: "Failed to generate share link" },
      { status: 500 }
    );
  }
}