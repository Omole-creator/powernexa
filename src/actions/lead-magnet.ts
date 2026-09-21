"use server";

import { createLeadMagnetSignup } from "@/lib/lead-magnet";
import { recordEvent } from "@/lib/analytics";
import { requiredString, optionalString, isValidNigerianPhone, isValidEmail } from "@/lib/validation";
import { LEAD_MAGNETS, DEFAULT_LEAD_MAGNET } from "@/lib/lead-magnets";

export type LeadMagnetFormState = {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitLeadMagnetSignup(
  _prevState: LeadMagnetFormState,
  formData: FormData
): Promise<LeadMagnetFormState> {
  const name = requiredString(formData.get("name"), 120);
  const email = requiredString(formData.get("email"), 150);
  const phone = requiredString(formData.get("phone"), 30);
  const magnetSlug = optionalString(formData.get("magnetSlug"), 80) ?? DEFAULT_LEAD_MAGNET.slug;
  const sourcePage = optionalString(formData.get("sourcePage"), 200);
  const utmSource = optionalString(formData.get("utmSource"), 100);
  const utmMedium = optionalString(formData.get("utmMedium"), 100);
  const utmCampaign = optionalString(formData.get("utmCampaign"), 100);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!email) fieldErrors.email = "Please add your email.";
  else if (!isValidEmail(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!phone) fieldErrors.phone = "Please add a phone number.";
  else if (!isValidNigerianPhone(phone)) fieldErrors.phone = "Please enter a valid Nigerian phone number.";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await createLeadMagnetSignup({
    name: name!,
    email: email!,
    phone: phone!,
    magnetSlug,
    sourcePage,
    utmSource,
    utmMedium,
    utmCampaign,
  });

  await recordEvent({
    eventType: "lead_magnet_signup",
    pagePath: sourcePage ?? "/",
    utmSource,
    utmMedium,
    utmCampaign,
    isBot: false,
  });

  const magnet = LEAD_MAGNETS[magnetSlug] ?? DEFAULT_LEAD_MAGNET;
  return { success: true, downloadUrl: magnet.fileUrl };
}
