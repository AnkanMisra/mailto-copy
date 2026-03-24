# mailto:copy

Browser extension (Chrome & Firefox) that intercepts `mailto:` links and copies the email address to the clipboard instead of opening the system email app.

![mailto:copy logo](./logo.svg)

## Load locally

**Chrome:**
1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select this folder.

**Firefox:**
1. Open `about:debugging#/runtime/this-firefox`.
2. Click Load Temporary Add-on...
3. Select the `manifest.json` file in this folder.

## Behavior

- Captures `mailto:` link activation in the capture phase.
- Prevents the browser's default email-client launch.
- Copies just the email address, not query params like `subject=` or `body=`.
- Shows a small toast confirming the copy action.

## Build package

1. Run `npm run build`.
2. Find the release zips in `dist/`.

The build script will:

- Regenerate `icons/icon-16.png`, `icons/icon-32.png`, `icons/icon-48.png`, and `icons/icon-128.png` from `logo.svg`.
- Assemble a clean extension package.
- Create versioned zips for Chrome and Firefox, e.g., `dist/mailto-copy-chrome-v1.0.0.zip` and `dist/mailto-copy-firefox-v1.0.0.zip`.

## Release

1. Update the version in `manifest.json`.
2. Run `npm run build`.
3. Open `chrome://extensions` (or `about:debugging` in Firefox) and load the extension for a final smoke test.
4. Verify the icon appears in the extensions page and the extension still copies `mailto:` addresses correctly.
5. Open the Chrome Web Store Developer Dashboard and/or the Mozilla Add-ons Developer Hub.
6. Upload the respective zip from `dist/`.
7. Fill in or confirm the store listing details:
   - Extension name and description
   - At least one screenshot
   - Category and language
   - Privacy disclosures and single-purpose justification, if requested by the dashboard
8. Submit the new item or updated version for review.

## Notes for publishing

- Chrome Web Store expects a `128x128` icon in the package; this repo now generates it automatically from `logo.svg`.
- The store listing may also ask for larger promotional assets, which are separate from the extension package icons.