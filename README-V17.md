# Scialdoni Realty — Version 17

Built directly from the supplied Version 16 ZIP. All nine pages, property-search links, photos, architectural renderings, brokerage details, and GoDaddy settings are otherwise preserved.

## Completed site changes

- Replaced the old typographic SR mark in **all nine page headers** and the footers with Ed's provided silver-and-navy `scialdoni-logo.png` image.
- Removed the three **STYLE INSPIRATION** ribbons from the Featured Home Styles image cards without changing the house photos or the card layouts.
- Removed stale explicit **30-minute** meeting descriptions. The existing Calendly link is preserved so booking buttons do not break. **Calendly's actual duration still needs to be changed from 30 to 15 minutes in Ed's Calendly account.** Editing HTML cannot change the hosted event.
- Replaced the demonstration contact form with a form that collects name, email, optional phone, inquiry type, message, and consent. It is compatible with Google Apps Script and Google Sheets.
- Updated the social-share image metadata to the exact new logo artwork, rather than an old branded image.

## The only remaining activation steps

### 1. Set Ed's Calendly event to 15 minutes

- Log into his Calendly account and open **Scheduling → Event types → 30 Minute Meeting**.
- Edit the existing event **Duration** to **15 minutes**, check **Phone call** and his availability, and save. You can also rename the event to `15-Minute Real Estate Consultation`.
- **Keep the event URL unchanged** if possible: `https://calendly.com/escialdoni/30min`. The `30min` slug does not automatically change when duration changes. If you choose a new event URL, update all website links to the new URL before publishing.
- Make a test appointment to verify the public booking page actually shows 15 minutes.

### 2. Activate the contact form → Google Sheets → Ed email

The website is static GitHub Pages. It **cannot write directly to a private Google Sheet or send email** without a server-side endpoint that is owned and authorized by a Google account. We have provided the complete server-side script and a ready-to-connect form. **The Google Sheet and notification emails are not live until the steps below are finished.**

1. With an authorized Google account that will own the submissions, go to **https://sheets.new**. Create a blank spreadsheet named `Scialdoni Realty – Website Inquiries`.
2. In the spreadsheet select **Extensions → Apps Script**.
3. Replace the contents of the default `Code.gs` file with **`GOOGLE-APPS-SCRIPT.gs`** from this ZIP. Save.
4. Choose **Deploy → New deployment → Select type: Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone** so public website visitors can submit. Approve the requested Google authorization screens. *This publishes a submission endpoint, not the spreadsheet; do not publicly share the spreadsheet itself.*
6. Click **Deploy** and copy the **Web app URL** ending in `/exec`.
7. Open `contact-config.js` in the website files and paste that URL between the quotes for `endpoint`. Example (illustration only):
   ```js
   window.SCIALDONI_CONTACT_CONFIG = {
     endpoint: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   };
   ```
8. Re-upload `contact-config.js` to the same GitHub Pages repository (or provide the real `/exec` URL and we can generate an updated ZIP). Once configured, the form switches from the **EMAIL MY INQUIRY** fallback to **SEND MESSAGE**.
9. Test with a real inquiry using a different email address. A **new tab must show “Message received.”** Confirm that the `Inquiries` tab in the Google Sheet contains the new row and that `ed@scialdonirealty.com` received the notification email. Also check spam if needed.
10. Ensure the Google account deploying the script has permission to send email and has sufficient daily MailApp quota. Do not put account credentials in the website code.

**Before activation:** The form deliberately opens the visitor's email application with their message addressed to Ed and asks them to click Send. It does **not** claim to submit to Google Sheets or email automatically.

**After activation:** The form submits a normal browser POST to the Google Apps Script web app, which validates the fields, appends a row to the Google Sheet and emails Ed. A confirmation page opens in a new tab; the original website stays open. The script contains basic anti-spam and duplicate-submission protection, but public forms still need monitoring.

### Privacy and safety

Only collect information needed to respond to inquiries. Keep the Google Sheet private, restrict Google account access and don't publish Ed's Gmail or GoDaddy passwords. Before production use, ensure the website has an appropriate privacy notice and retention practice. GitHub Pages itself is public and isn't an email or database host.

## Deployment

Publish the extracted files at the root of a new `scialdoni-realty-v17` GitHub repository. Enable Settings → Pages → Deploy from a branch `main`, `/(root)`. The expected URL is `https://thaha3000.github.io/scialdoni-realty-v17/`.

**Do not change GoDaddy DNS or nameservers as part of this update.** DNS/email migration planning remains separate.
