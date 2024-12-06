import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/lucia";
import sharp from "sharp";
import { db } from "@/lib/db";
import { images } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { minioClient } from "@/lib/storage/minio";

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } }
) {
  try {
    const authRequest = auth.handleRequest(request);
    const session = await authRequest.validate();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const quality = searchParams.get("quality");
    const watermark = searchParams.get("watermark") === "true";

    const image = await db.query.images.findFirst({
      where: eq(images.id, params.imageId),
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    if (image.userId !== session.user.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the image from MinIO
    const objectName = image.processedUrl.split("/").pop()!;
    const imageBuffer = await minioClient
      .getObject("design-space-ai", objectName)
      .then((stream) => {
        return new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("end", () => resolve(Buffer.concat(chunks)));
          stream.on("error", reject);
        });
      });

    let processedBuffer = sharp(imageBuffer);

    // Apply quality settings
    if (quality === "web") {
      processedBuffer = processedBuffer.resize(1280, null, {
        withoutEnlargement: true,
      });
    }

    // Add watermark if requested
    if (watermark) {
      processedBuffer = processedBuffer.composite([
        {
          input: {
            text: {
              text: "Interior AI",
              font: "Arial",
              rgba: true,
              opacity: 0.5,
            },
          },
          gravity: "southeast",
        },
      ]);
    }

    const finalBuffer = await processedBuffer.toBuffer();

    return new Response(finalBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="interior-ai-${quality}${
          watermark ? "-watermark" : ""
        }.png"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}