import imageCompression from "browser-image-compression";

export interface CompressOptions {
  maxWidthOrHeight?: number;
  maxSizeMB?: number;
  quality?: number;
}

/**
 * Resizes and re-encodes an admin-uploaded photo to WebP client-side before
 * it ever reaches Supabase Storage — this is what stops another 9MB PNG
 * from being uploaded in the first place. Falls back to the original file
 * if compression fails for any reason, so an upload never gets blocked by it.
 */
export async function compressImageFile(
  file: File,
  { maxWidthOrHeight = 1600, maxSizeMB = 0.6, quality = 0.8 }: CompressOptions = {},
): Promise<File> {
  try {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight,
      maxSizeMB,
      initialQuality: quality,
      fileType: "image/webp",
      useWebWorker: true,
    });
    // browser-image-compression keeps the original filename/extension even
    // though the bytes are now WebP — rename so the stored object's
    // extension matches its actual content.
    const renamed = file.name.replace(/\.[^./\\]+$/, "") + ".webp";
    return new File([compressed], renamed, { type: "image/webp" });
  } catch (err) {
    console.warn("[imageCompression] compression failed, uploading original file:", err);
    return file;
  }
}
