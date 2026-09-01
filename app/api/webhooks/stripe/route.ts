import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDonationReceipt } from "@/lib/resend";
import { syncToSheet } from "@/lib/sheets";
import type { DonationKind } from "@/lib/types";

async function recordDonation(params: {
  donorName: string;
  donorEmail: string;
  amountCents: number;
  kind: DonationKind;
  programId: string | null;
  programName: string | null;
  paymentIntentId?: string | null;
  subscriptionId?: string | null;
}) {
  const supabase = createAdminClient();
  await supabase.from("donations").insert({
    donor_name: params.donorName,
    donor_email: params.donorEmail,
    amount_cents: params.amountCents,
    kind: params.kind,
    program_id: params.programId,
    stripe_payment_intent_id: params.paymentIntentId ?? null,
    stripe_subscription_id: params.subscriptionId ?? null,
  });

  await Promise.all([
    sendDonationReceipt({
      donorEmail: params.donorEmail,
      donorName: params.donorName,
      amountCents: params.amountCents,
      kind: params.kind,
      programName: params.programName ?? undefined,
    }),
    syncToSheet({
      type: "donation",
      donorName: params.donorName,
      donorEmail: params.donorEmail,
      amountCents: params.amountCents,
      kind: params.kind,
      program: params.programName,
      createdAt: new Date().toISOString(),
    }),
  ]);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return NextResponse.json({ error: `Invalid signature: ${(error as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};
    const kind = (metadata.kind as DonationKind) ?? "one_time";
    const programId = metadata.program_id || null;
    const programName = metadata.program_name || null;

    await recordDonation({
      donorName: session.customer_details?.name ?? "",
      donorEmail: session.customer_details?.email ?? "",
      amountCents: session.amount_total ?? 0,
      kind,
      programId,
      programName,
      paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
      subscriptionId: typeof session.subscription === "string" ? session.subscription : null,
    });
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    // The first invoice on a new subscription is already recorded via
    // checkout.session.completed — only renewals land here.
    if (invoice.billing_reason === "subscription_cycle") {
      const subscriptionId = invoice.parent?.subscription_details?.subscription;
      const subscription =
        typeof subscriptionId === "string" ? await getStripe().subscriptions.retrieve(subscriptionId) : null;
      const metadata = subscription?.metadata ?? {};
      const kind = (metadata.kind as DonationKind) ?? "monthly";

      await recordDonation({
        donorName: invoice.customer_name ?? "",
        donorEmail: invoice.customer_email ?? "",
        amountCents: invoice.amount_paid,
        kind,
        programId: metadata.program_id || null,
        programName: metadata.program_name || null,
        subscriptionId: typeof subscriptionId === "string" ? subscriptionId : null,
      });
    }
  }

  return NextResponse.json({ received: true });
}
