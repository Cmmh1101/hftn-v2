import { Resend } from "resend";
import { formatCents } from "@/lib/format";
import type { DonationKind } from "@/lib/types";

let resendClient: Resend | null = null;

/** Lazily constructed so build-time module collection doesn't need RESEND_API_KEY. */
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM = "Hope For The Nations <donations@hopeforthenations7.org>";

const KIND_COPY: Record<DonationKind, string> = {
  one_time: "one-time gift",
  monthly: "monthly gift",
  sponsorship: "student sponsorship",
};

export async function sendDonationReceipt(params: {
  donorEmail: string;
  donorName: string;
  amountCents: number;
  kind: DonationKind;
  programName?: string;
}) {
  const { donorEmail, donorName, amountCents, kind, programName } = params;
  const designation = programName ? ` to ${programName}` : "";

  await getResend().emails.send({
    from: FROM,
    to: donorEmail,
    subject: "Thank you for your gift to Hope For The Nations",
    html: `
      <p>Dear ${donorName || "friend"},</p>
      <p>Thank you for your ${KIND_COPY[kind]} of <strong>${formatCents(amountCents)}</strong>${designation}.
      Your generosity funds jornadas, School of Hope, and relief where it's needed most.</p>
      <p>With gratitude,<br/>Hope For The Nations</p>
    `,
  });
}

export async function sendContactNotification(params: { name: string; email: string; message: string }) {
  await getResend().emails.send({
    from: FROM,
    to: process.env.CONTACT_INBOX_EMAIL ?? "admin@hopeforthenations7.org",
    replyTo: params.email,
    subject: `New contact form message from ${params.name}`,
    html: `<p><strong>${params.name}</strong> (${params.email}) wrote:</p><p>${params.message}</p>`,
  });
}

export async function sendContactConfirmation(params: { name: string; email: string }) {
  await getResend().emails.send({
    from: FROM,
    to: params.email,
    subject: "We received your message — Hope For The Nations",
    html: `
      <p>Hi ${params.name},</p>
      <p>Thanks for reaching out to Hope For The Nations. Someone from our team will get back to you soon.</p>
      <p>Hope For The Nations</p>
    `,
  });
}
