/**
 * Hope For The Nations — donation & contact sync
 *
 * Setup:
 * 1. Create (or open) the Google Sheet you want donations/contacts synced to.
 * 2. Extensions → Apps Script. Delete the default code and paste this file in.
 * 3. Project Settings (gear icon) → Script Properties → add a property named
 *    SHARED_SECRET with a long random value you make up.
 * 4. Deploy → New deployment → type "Web app". Execute as "Me", access
 *    "Anyone". Deploy and copy the Web App URL.
 * 5. In the Next.js app's .env.local, set:
 *      GOOGLE_SHEETS_WEBHOOK_URL=<the Web App URL>
 *      GOOGLE_SHEETS_SHARED_SECRET=<the same value from step 3>
 *
 * Two tabs are created automatically the first time each type of event
 * arrives: "Donations" and "Contacts".
 */

const DONATION_HEADERS = ["Date", "Donor name", "Donor email", "Amount", "Type", "Program"];
const CONTACT_HEADERS = ["Date", "Name", "Email", "Message"];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);

  const expectedSecret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET");
  if (expectedSecret && payload.secret !== expectedSecret) {
    return jsonResponse({ ok: false, error: "unauthorized" });
  }

  if (payload.type === "donation") {
    appendRow("Donations", DONATION_HEADERS, [
      payload.createdAt,
      payload.donorName,
      payload.donorEmail,
      (payload.amountCents / 100).toFixed(2),
      payload.kind,
      payload.program || "",
    ]);
  } else if (payload.type === "contact") {
    appendRow("Contacts", CONTACT_HEADERS, [payload.createdAt, payload.name, payload.email, payload.message]);
  } else {
    return jsonResponse({ ok: false, error: "unknown type" });
  }

  return jsonResponse({ ok: true });
}

function appendRow(sheetName, headers, row) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
    sheet.appendRow(headers);
  }
  sheet.appendRow(row);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
