import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { supabase } from "@/lib/supabase";
import { logAudit } from "@/lib/audit";
import { PHOTO_BUCKET, addPhoto } from "@/lib/customer-systems";

const MAX_BYTES = 5 * 1024 * 1024;

// Installation photos for a My System page. The bucket is private: customers
// see these only through signed links on their own page.
export async function POST(request: Request) {
  const admin = await verifySession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const systemId = Number(formData.get("systemId"));
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 120) || null;
  if (!Number.isInteger(systemId) || systemId < 1) {
    return NextResponse.json({ error: "Missing customer system." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was uploaded." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files can be uploaded." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 5MB or smaller." }, { status: 400 });
  }

  const extension = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${systemId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let { error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError && /bucket not found/i.test(uploadError.message)) {
    await supabase.storage.createBucket(PHOTO_BUCKET, { public: false });
    ({ error: uploadError } = await supabase.storage.from(PHOTO_BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    }));
  }

  if (uploadError) {
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }

  try {
    await addPhoto(systemId, path, caption);
  } catch {
    await supabase.storage.from(PHOTO_BUCKET).remove([path]);
    return NextResponse.json({ error: "Could not save the photo. Has the My System SQL been run?" }, { status: 500 });
  }
  await logAudit(admin.email, "add_system_photo", `system #${systemId}${caption ? `: ${caption}` : ""}`);
  revalidatePath(`/admin/systems/${systemId}`);
  return NextResponse.json({ ok: true });
}
