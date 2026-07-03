import type { SupabaseClient } from "@supabase/supabase-js"

export async function uploadToBucket(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  file: Blob | Buffer,
  contentType?: string
) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  })
  if (error) throw error
}

export async function removeFromBucket(supabase: SupabaseClient, bucket: string, path: string) {
  await supabase.storage.from(bucket).remove([path])
}

export async function getSignedUrl(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  expiresIn = 3600
) {
  const { data } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn)
  return data?.signedUrl ?? null
}
