"use server";

import { createLead } from "@/lib/leads";
import { recordEvent } from "@/lib/analytics";
import { quoteWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { requiredString, optionalString, isValidNigerianPhone } from "@/lib/validation";
import { QUOTE_WHATSAPP_NUMBER } from "@/lib/constants";

export type QuoteFormState = {
  success: boolean;
  whatsappUrl?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitQuote(_prevState: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  const name = requiredString(formData.get("name"), 120);
  const phone = requiredString(formData.get("phone"), 30);
  const area = requiredString(formData.get("area"), 80);
  const propertyType = requiredString(formData.get("propertyType"), 40);
  const serviceInterest = requiredString(formData.get("serviceInterest"), 120);
  const budgetRange = optionalString(formData.get("budgetRange"), 60);
  const message = optionalString(formData.get("message"), 1000);
  const sourcePage = optionalString(formData.get("sourcePage"), 200);
  const utmSource = optionalString(formData.get("utmSource"), 100);
  const utmMedium = optionalString(formData.get("utmMedium"), 100);
  const utmCampaign = optionalString(formData.get("utmCampaign"), 100);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!phone) fieldErrors.phone = "Please add a phone number.";
  else if (!isValidNigerianPhone(phone)) fieldErrors.phone = "Please enter a valid Nigerian phone number.";
  if (!area) fieldErrors.area = "Please select the area in Lagos.";
  if (!propertyType) fieldErrors.propertyType = "Please select a property type.";
  if (!serviceInterest) fieldErrors.serviceInterest = "Please select the service you need.";

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  await createLead({
    name: name!,
    phone: phone!,
    area: area!,
    propertyType: propertyType!,
    serviceInterest: serviceInterest!,
    budgetRange,
    message,
    sourcePage,
    utmSource,
    utmMedium,
    utmCampaign,
  });

  await recordEvent({
    eventType: "quote_form_submit",
    pagePath: sourcePage ?? "/get-a-quote",
    utmSource,
    utmMedium,
    utmCampaign,
    isBot: false,
  });

  const whatsappUrl = buildWhatsAppUrl(
    quoteWhatsAppMessage({
      name: name!,
      phone: phone!,
      area: area!,
      propertyType: propertyType!,
      serviceInterest: serviceInterest!,
      budgetRange,
      message,
    }),
    QUOTE_WHATSAPP_NUMBER
  );

  return { success: true, whatsappUrl };
}
