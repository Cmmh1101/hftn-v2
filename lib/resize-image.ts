// Shrinks a photo in the browser before it is uploaded. Phone photos are often
// 4–10 MB, which is slow on a poor connection and larger than a server request
// may be; 1800px on the long side looks sharp on any screen at a fraction of the size.
export async function resizeImage(file: File, maxSide = 1800, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    // Keep the original when re-encoding would not make it smaller.
    if (!blob || (scale === 1 && blob.size >= file.size)) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
