/**
 * Scialdoni Realty - Google Sheets Contact Intake
 *
 * INSTALLATION:
 * 1. Sign in to a Google account that will own the inquiries spreadsheet.
 * 2. Create a new Google Sheet (e.g., "Scialdoni Realty — Inquiries").
 * 3. Extensions > Apps Script; replace Code.gs with this file.
 * 4. Deploy > New deployment > Web app.
 *    Execute as: Me. Who has access: Anyone.
 * 5. Authorize; copy the Web app URL ending in /exec.
 * 6. Paste that URL into contact-config.js, and upload the updated file to GitHub.
 * 7. Submit a real test inquiry, verify the sheet row and Ed's notification email.
 *
 * Do not publish this file's Google account credentials or deployment keys.
 * The website calls this as a standard browser FORM POST, not CORS fetch.
 */
const DESTINATION_EMAIL = 'ed@scialdonirealty.com';
const TAB_NAME = 'Inquiries';
const HEADERS = [
  'Received at', 'Full name', 'Email', 'Phone',
  'Reason for inquiry', 'Message', 'Consent', 'Source', 'Email notification'
];

function doPost(e) {
  const p = (e && e.parameter) ? e.parameter : {};
  // Bots often complete hidden fields. Return a generic response without recording the entry.
  if (String(p.website || '').trim()) return receipt_(true, 'Thank you for contacting Scialdoni Realty.');

  const name = String(p.name || '').trim().slice(0, 120);
  const email = String(p.email || '').trim().slice(0, 240);
  const phone = String(p.phone || '').trim().slice(0, 45);
  const reason = String(p.inquiry || '').trim().slice(0, 100);
  const message = String(p.message || '').trim().slice(0, 2000);
  const consent = String(p.consent || '').trim();

  if (!name || !message || !email || !/^\S+@\S+\.\S+$/.test(email) || consent !== 'Yes') {
    return receipt_(false, 'Please complete all required fields and try again.');
  }
  // A short per-email cooldown reduces accidental duplicate records and simple spam.
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, email.toLowerCase());
  const key = 'v17-' + Utilities.base64EncodeWebSafe(digest).slice(0, 40);
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) {
    return receipt_(false, 'We recently received an inquiry from this email. Please wait a minute before sending another.');
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return receipt_(false, 'Our contact form is temporarily busy. Please try again.');
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    if (!book) throw new Error('Create this Apps Script FROM the Google Sheet (Extensions > Apps Script).');
    let sheet = book.getSheetByName(TAB_NAME);
    if (!sheet) {
      sheet = book.insertSheet(TAB_NAME);
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#15203a').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 1, 160);
      sheet.setColumnWidths(2, 4, 185);
      sheet.setColumnWidth(6, 440);
    }
    const safe = value => /^[\s]*[=+\-@]/.test(value) ? "'" + value : value;
    const received = new Date();
    const row = [received, safe(name), safe(email), safe(phone), safe(reason), safe(message), 'Yes', 'Scialdoni Realty website', 'Pending'];
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    sheet.getRange(nextRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    cache.put(key, '1', 60);
    let emailStatus = 'Sent';
    try {
      MailApp.sendEmail({
        to: DESTINATION_EMAIL,
        replyTo: email,
        name: 'Scialdoni Realty Website',
        subject: 'New website inquiry: ' + reason,
        body: 'A new inquiry was submitted on the Scialdoni Realty website.\n\n'
          + 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone
          + '\nReason: ' + reason + '\n\nMessage:\n' + message
          + '\n\nReceived: ' + received.toString()
          + '\n\nThe inquiry has also been stored in the Google Sheet.'
      });
    } catch (mailError) {
      emailStatus = 'Failed - check Apps Script execution log';
      console.error('Mail notification error', mailError);
    }
    sheet.getRange(nextRow, HEADERS.length).setValue(emailStatus);
    if (emailStatus !== 'Sent') return receipt_(true, 'Your message was saved. Please contact the office if your inquiry is urgent.');
    return receipt_(true, 'Your message was received. Scialdoni Realty will be in touch.');
  } catch(err) {
    console.error('Contact submission failed', err);
    return receipt_(false, 'Your message could not be sent. Please email ed@scialdonirealty.com or call 781-771-9729.');
  } finally {
    lock.releaseLock();
  }
}

function receipt_(success, message) {
  const title = success ? 'Message received' : 'Message not sent';
  const icon = success ? '&#10003;' : '!';
  const text = String(message).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = 'https://thaha3000.github.io/scialdoni-realty-v17/';
  return HtmlService.createHtmlOutput('<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + title + ' | Scialdoni Realty</title></head>'
    + '<body style="margin:0;background:#f7f5f0;color:#18213d;font-family:Arial,sans-serif;display:grid;min-height:100vh;place-items:center">'
    + '<main style="max-width:540px;background:white;padding:42px 32px;box-shadow:0 12px 42px #0001;text-align:center">'
    + '<div style="font-size:30px;color:#b58c48">' + icon + '</div><h1>' + title + '</h1><p style="line-height:1.8">' + text + '</p>'
    + '<a href="' + url + '" target="_top" style="color:#142047;font-weight:bold">Return to Scialdoni Realty</a></main></body></html>');
}
