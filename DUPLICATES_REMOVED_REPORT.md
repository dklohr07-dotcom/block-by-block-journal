# Duplicates Removed Report

I cleaned this upload package by removing duplicate and outdated files that were likely causing GitHub/Railway confusion.

## Removed

- Removed the nested duplicate folder: `block-by-block-journal-main/block-by-block-journal-main/`
- Removed duplicate generated files: `*.0.js` and `*.check.js`
- Removed orphan file: `:assets:rain-room-realm-bg.jpg`
- Removed older background CSS files that were not needed in the clean build:
  - `background-overrides.css`
  - `rain-room-background.css`

## Kept

- The main app files at the project root
- The `/realms` folder
- The `/custom-backgrounds` folder
- The `/shared` folder
- The sound files folder exactly as found in your uploaded zip

## Background fix included

The root `mind-reset-hub.html` now also references the uploaded custom background images for the hub cards.
The individual premium realm pages still load `realms/realm-backgrounds.css`, which points to `../custom-backgrounds/`.

## Expected upload structure

Upload the CONTENTS of this folder to the root of your GitHub repo, not the folder itself. The repo should show files like `index.html`, `server.js`, `package.json`, plus folders like `realms`, `shared`, and `custom-backgrounds` at the top level.
