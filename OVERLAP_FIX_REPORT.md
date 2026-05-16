# Mind Reset Hub Overlap Fix Report

## What was still causing the overlap

`index.html` still had old built-in realm art in the main CSS. These were not in `mind-reset-hub.html`, so deleting that file did not fix the issue.

The main conflicting areas were:

- `.realm-rain` had an old full `background:` definition with an embedded SVG pixel scene.
- `.realm-campfire` had an old full `background:` definition with an embedded SVG cave/campfire scene.
- `.realm-mine`, `.realm-biome`, and `.realm-stage::before` had old generated pixel/grid layers.
- The previous patch used `background-image`, but the older CSS also used full `background:` shorthand and pseudo-elements, so the old layers could still appear.

## What changed

A final CSS patch was placed at the very end of the main `<style>` block in `index.html` so it wins over the old CSS.

The patch:

- Forces premium Mind Reset Hub cards to use `/custom-backgrounds/*.jpg`.
- Forces the interactive realm canvases to use `/custom-backgrounds/*.jpg`.
- Removes old card pseudo-art layers.
- Removes old realm `::before` pixel/SVG overlays.
- Keeps Rain Room rain animation as a transparent overlay only.
- Stops biome cards/previews from showing old SVG mini-scenes over the custom background.

## Upload notes

Upload the full zip contents to GitHub, especially:

- `index.html`
- `custom-backgrounds/rain-room.jpg`
- `custom-backgrounds/miner.jpg`
- `custom-backgrounds/campfire.jpg`
- `custom-backgrounds/biome.jpg`

If you still see old art after upload, clear browser cache or open the app in a private/incognito window.
