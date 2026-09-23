import { WHATSAPP_NUMBER } from "./constants";

export function buildWhatsAppUrl(message: string, number: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function defaultWhatsAppMessage(): string {
  return "Hi PowerNexa Solutions, I'd like to ask about solar and inverter installation in Lagos.";
}

export function quoteWhatsAppMessage(input: {
  name: string;
  phone: string;
  area: string;
  propertyType: string;
  serviceInterest: string;
  budgetRange?: string;
  loadProfile?: string;
  message?: string;
}): string {
  const lines = [
    "Hi PowerNexa Solutions, I just submitted a quote request on your website.",
    "",
    `Name: ${input.name}`,
    `Phone: ${input.phone}`,
    `Area: ${input.area}`,
    `Property type: ${input.propertyType}`,
    `Service needed: ${input.serviceInterest}`,
  ];
  if (input.loadProfile) lines.push(`Want to power: ${input.loadProfile}`);
  if (input.budgetRange) lines.push(`Budget range: ${input.budgetRange}`);
  if (input.message) lines.push(`Message: ${input.message}`);
  lines.push("", "Please can someone get back to me?");
  return lines.join("\n");
}
