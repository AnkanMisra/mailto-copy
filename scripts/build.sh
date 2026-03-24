#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
PACKAGE_DIR="$DIST_DIR/package"
MANIFEST_PATH="$ROOT_DIR/manifest.json"
LOGO_PATH="$ROOT_DIR/logo.svg"
VERSION="$(node -p "require('$MANIFEST_PATH').version")"
CHROME_ARCHIVE="mailto-copy-chrome-v${VERSION}.zip"
FIREFOX_ARCHIVE="mailto-copy-firefox-v${VERSION}.zip"

for cmd in node sips zip; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
done

if [[ ! -f "$LOGO_PATH" ]]; then
  echo "Missing logo: $LOGO_PATH" >&2
  exit 1
fi

mkdir -p "$ROOT_DIR/icons"

render_icon() {
  local size="$1"
  local output="$ROOT_DIR/icons/icon-${size}.png"
  sips -s format png -z "$size" "$size" "$LOGO_PATH" --out "$output" >/dev/null
}

render_icon 16
render_icon 32
render_icon 48
render_icon 128

rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

cp "$ROOT_DIR/content.js" "$PACKAGE_DIR/"
cp -R "$ROOT_DIR/icons" "$PACKAGE_DIR/"

rm -f "$DIST_DIR/$CHROME_ARCHIVE" "$DIST_DIR/$FIREFOX_ARCHIVE"
(
  cd "$PACKAGE_DIR"

  # Chrome build: strip browser_specific_settings
  node -e "
    const m = require('$MANIFEST_PATH');
    delete m.browser_specific_settings;
    process.stdout.write(JSON.stringify(m, null, 2));
  " > manifest.json
  zip -rq "../$CHROME_ARCHIVE" manifest.json content.js icons

  # Firefox build: restore original manifest
  cp "$MANIFEST_PATH" manifest.json
  zip -rq "../$FIREFOX_ARCHIVE" manifest.json content.js icons
)

echo "Built $DIST_DIR/$CHROME_ARCHIVE"
echo "Built $DIST_DIR/$FIREFOX_ARCHIVE"
