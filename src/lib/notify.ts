import "server-only";
import nodemailer from "nodemailer";
import { CONTACT_EMAIL, SITE_URL } from "./constants";

// New-lead alerts sent through the owner's Gmail (app password, no paid
// email service). GMAIL_USER / GMAIL_APP_PASSWORD are set in .env.local and
// Vercel; without them, alerts are skipped and the lead is still saved.
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || CONTACT_EMAIL;

export type LeadAlert = {
  name: string;
  phone: string;
  area: string;
  propertyType: string;
  serviceInterest: string;
  budgetRange?: string;
  loadProfile?: string;
  message?: string;
  sourcePage?: string;
};

export async function sendLeadAlert(lead: LeadAlert): Promise<void> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  const lines = [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Area: ${lead.area}`,
    `Property: ${lead.propertyType}`,
    `Service: ${lead.serviceInterest}`,
    lead.loadProfile ? `Wants to power: ${lead.loadProfile}` : null,
    lead.budgetRange ? `Budget: ${lead.budgetRange}` : null,
    lead.message ? `\nMessage:\n${lead.message}` : null,
    lead.sourcePage ? `\nSent from: ${lead.sourcePage}` : null,
    `\nAll leads: ${SITE_URL}/admin/leads`,
  ].filter(Boolean);

  const digits = lead.phone.replace(/\D/g, "");
  const whatsapp = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  lines.push(`WhatsApp them: https://wa.me/${whatsapp}`);

  await transport.sendMail({
    from: `"PowerNexa Website" <${GMAIL_USER}>`,
    to: NOTIFY_EMAIL,
    subject: `New quote request: ${lead.name}, ${lead.area}`,
    text: lines.join("\n"),
  });
}
