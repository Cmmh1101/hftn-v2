type SheetPayload =
  | { type: "donation"; donorName: string; donorEmail: string; amountCents: number; kind: string; program: string | null; createdAt: string }
  | { type: "contact"; name: string; email: string; message: string; createdAt: string };

/**
 * Fire-and-forget sync to the Google Apps Script Web App (see apps-script/hftn-sync.gs).
 * Never throws — a Sheets outage should never block a donation or contact submission.
 */
export async function syncToSheet(payload: SheetPayload) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: process.env.GOOGLE_SHEETS_SHARED_SECRET ?? "" }),
    });
  } catch (error) {
    console.error("Failed to sync to Google Sheet:", error);
  }
}
