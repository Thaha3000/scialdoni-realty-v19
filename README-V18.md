# Scialdoni Realty — Version 18

Built from the exact `scialdoni-realty-v17(1).zip` supplied by the developer. It is a complete standalone website; **Version 17 and earlier repositories do not need to remain deployed** for Version 18 to function.

## Updates made

1. Replaced `scialdoni-logo.png` with the supplied final navy-and-silver Scialdoni Realty logo. Every one of the nine page headers and footers already references that single local filename and now uses the new file. Layout, font styling, all other page content, and property photographs remain unchanged.
2. Replaced Philip Scialdoni's headshot with the supplied `Polished Realty Executive Headshot.png`; restored the missing `philip.png` and also refreshed `philip2.png`. Verified the homepage profile, biography page and dynamically generated profile modal reference `philip.png`.
3. Replaced David DiLisio's headshot with the supplied `Polished Realty Executive Portrait (1).png`; homepage, biography page and profile modal all reference `david.png`. Ed's existing portrait remains unchanged.
4. Rebuilt the social preview image (`scialdoni-share.jpg`, 1200 × 630) from the approved logo, and updated Open Graph / Twitter metadata on all nine HTML pages to that image and to the expected Version 18 URLs.
5. Added `favicon.png` extracted from the supplied SR monogram to all nine pages.
6. **Restored the user's deployed Google Apps Script /exec URL** in `contact-config.js`. The uploaded V17 ZIP still had an empty endpoint, which would otherwise have caused the contact form to fall back to the visitor's email app.

## Deployment for Zack

- Upload **all extracted files** in this folder to the web host's public document root. The `index.html`, other `.html` pages, images, `.css`, `.js` and `.gs` files belong at the same root level, exactly as packaged.
- Alternatively, create a NEW GitHub repository named `scialdoni-realty-v18` (do not overwrite past versions), upload all site files to repository root and enable GitHub Pages on `main` `/(root)`. Expected preview: `https://thaha3000.github.io/scialdoni-realty-v18/`.
- On the finished domain `scialdonirealty.com`, replace the V18 GitHub canonical and Open Graph URL references with the final custom-domain URL so search/social results point to the live domain. If the site is directly deployed to custom-domain hosting, this step is essential.
- **Do not change GoDaddy nameservers or email MX/SPF/DKIM/DMARC records** as part of this ordinary asset update. Ed's business email must remain functional.
- The Google Apps Script deployment URL is public and in `contact-config.js`, but the Google Sheet belongs to Ed/authorized account; do not put sheet credentials or business passwords in the website.
- Submit a real test inquiry from the live form. Confirm that a **Message received** page opens, a new row appears in the Google Sheet and Ed receives an email at `ed@scialdonirealty.com`. The packaged code is configured, but external delivery can't be verified by static file checks.
- Test the MLS search, Calendly booking URL, mobile navigation, all nine pages, each profile image, and the social preview.

## Files intentionally unchanged

All source property photographs and rendering files, page HTML layout structures, CSS rules, core JavaScript, written biographies, IDX search URL, Calendly URLs and forms, plus Ed's original portrait. Historical version README files are retained for provenance; this V18 readme supersedes their configuration guidance.
