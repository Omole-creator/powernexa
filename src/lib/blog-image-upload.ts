// Browser-side helper shared by the blog content editor and the featured image
// field. Phone photos are often 4000px+ and over the 5MB upload cap, so JPEG,
// PNG and WebP files are scaled down in the browser before they're sent.

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_EDGE = 1920;
const RESIZABLE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type UploadedImage = { url: string; width: number; height: number };

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`"${file.name}" could not be read as an image.`));
    };
    img.src = url;
  });
}

async function shrink(file: File, img: HTMLImageElement): Promise<{ file: File; width: number; height: number }> {
  const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  // Small files that already fit are uploaded untouched.
  if (scale === 1 && file.size <= 1.5 * 1024 * 1024) return { file, width, height };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { file, width: img.naturalWidth, height: img.naturalHeight };
  // PNGs may have transparent areas; fill white so they don't turn black as JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) return { file, width: img.naturalWidth, height: img.naturalHeight };
  const name = file.name.replace(/\.[a-z0-9]+$/i, "") + ".jpg";
  return { file: new File([blob], name, { type: "image/jpeg" }), width, height };
}

export async function uploadBlogImage(file: File): Promise<UploadedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  let toSend = file;
  let width = 0;
  let height = 0;
  if (RESIZABLE_TYPES.includes(file.type)) {
    const img = await loadImage(file);
    ({ file: toSend, width, height } = await shrink(file, img));
  }

  if (toSend.size > MAX_UPLOAD_BYTES) {
    throw new Error(`"${file.name}" is larger than 5MB.`);
  }

  const body = new FormData();
  body.append("file", toSend);
  const res = await fetch("/api/admin/blog-image", { method: "POST", body });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed.");
  return { url: data.url, width, height };
}
