import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import type { DonationKind } from "@/lib/types";

function sponsorshipCancelAt(): number {
  const now = new Date();
  const year = now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear();
  return Math.floor(new Date(year, 11, 31, 23, 59, 59).getTime() / 1000);
}

export async function POST(request: Request) {
  const body = await request.json();
  const amountCents = Number(body.amountCents);
  const kind = body.kind as DonationKind;
  const programId = (body.programId as string | null) ?? null;
  const programName = (body.programName as string | null) ?? null;
  const locale = body.locale === "es" ? "es" : "en";

  if (!Number.isFinite(amountCents) || amountCents < 100) {
    return NextResponse.json({ error: "Enter an amount of at least $1." }, { status: 400 });
  }
  if (!["one_time", "monthly", "sponsorship"].includes(kind)) {
    return NextResponse.json({ error: "Invalid donation type." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3010";
  const productName = programName ? `Donation — ${programName}` : "Donation — wherever needed most";
  const metadata: Record<string, string> = {
    kind,
    program_id: programId ?? "",
    program_name: programName ?? "",
  };

  const session = await getStripe().checkout.sessions.create({
    mode: kind === "one_time" ? "payment" : "subscription",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountCents,
          product_data: { name: productName },
          ...(kind === "one_time" ? {} : { recurring: { interval: "month" } }),
        },
      },
    ],
    ...(kind !== "one_time"
      ? { subscription_data: { metadata, ...(kind === "sponsorship" ? { cancel_at: sponsorshipCancelAt() } : {}) } }
      : {}),
    metadata,
    success_url: `${siteUrl}/${locale}/donate/thank-you`,
    cancel_url: `${siteUrl}/${locale}/donate`,
  });

  return NextResponse.json({ url: session.url });
}
