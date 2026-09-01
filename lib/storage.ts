import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "media";

// A public-bucket URL is a predictable string, not a privileged lookup — build
// it directly so this stays safe to call from client components too (Photo is
// used inside client-side modals), rather than requiring the service-role
// client, which only exists server-side.
export function getPublicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return (file.type.split("/")[1] || "jpg").toLowerCase();
}

/** Uploads a file to `{folder}/{id}.{ext}`, overwriting any existing file at that path. Returns the stored path. */
export async function uploadFile(file: File, folder: string, id: string): Promise<string> {
  const path = `${folder}/${id}.${extensionFor(file)}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`Photo upload failed: ${error.message}`);
  return path;
}

export async function deleteFile(path: string | null | undefined): Promise<void> {
  if (!path) return;
  const supabase = createAdminClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
