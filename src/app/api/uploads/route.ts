import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";

const EXPRESS_API_URL = process.env.EXPRESS_API_URL ?? "http://localhost:4000";
const UPLOAD_PERMISSIONS = ["posts.write", "blog.library"];

/**
 * Hands the browser a short-lived token to upload one image straight to
 * Vercel Blob. Who may upload is Express's decision: the caller's session is
 * checked there before any token is issued.
 */
export async function POST(req: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error: "uploads_not_configured",
        message: "Image uploads aren't set up on this site yet. Paste an image link instead.",
      },
      { status: 503 },
    );
  }

  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        const me = await fetch(`${EXPRESS_API_URL}/api/auth/me`, {
          headers: { cookie: req.headers.get("cookie") ?? "" },
          cache: "no-store",
        });
        const user = me.ok ? ((await me.json()).user as { permissions: string[] }) : null;
        if (!user || !UPLOAD_PERMISSIONS.some((p) => user.permissions.includes(p))) {
          throw new Error("You don't have permission to upload images.");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: "upload_refused", message: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 },
    );
  }
}
