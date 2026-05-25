# Breathing Room Block Fix

This package wires the uploaded purple/blue block directly into `realms/breathing.html`.

Changed files:
- `realms/breathing.html`
- `custom-backgrounds/provided-breathing-block.png`
- `custom-backgrounds/breathing-block.png`
- `custom-backgrounds/breathing-block-xl.png`
- `custom-backgrounds/breathing-block-big.png`
- `custom-backgrounds/breathing-block-card.png`

Fix details:
- Replaced the breathing room image source with `../custom-backgrounds/provided-breathing-block.png?v=breathing-room-block-fix-2` to bypass stale browser/GitHub Pages caching.
- Added CSS overrides so old block styles, clip paths, or hidden states cannot cover the uploaded image.
- Kept the breathing behavior: grow on inhale, hold at max size, shrink on exhale.
