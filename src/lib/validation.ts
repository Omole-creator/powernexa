export function requiredString(value: FormDataEntryValue | null, maxLength = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export function optionalString(value: FormDataEntryValue | null, maxLength = 2000): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLength);
}

const NIGERIAN_PHONE_PATTERN = /^(\+?234|0)?[789][01]\d{8}$/;

export function isValidNigerianPhone(value: string): boolean {
  const digitsOnly = value.replace(/[\s-]/g, "");
  return NIGERIAN_PHONE_PATTERN.test(digitsOnly);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
