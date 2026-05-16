# Index Background Fix Report

The custom background images were not showing inside the Mind Reset Hub because `index.html` is a self-contained app page with its own inline CSS. It was not using `/realms/realm-backgrounds.css`.

The blocking rules were the inline `.realm-rain`, `.realm-mine`, `.realm-campfire`, and `.realm-biome` backgrounds inside `index.html`. Those rules used gradients and embedded SVG images, so the older backgrounds continued to appear.

This fix adds final CSS overrides at the end of the `index.html` style block using `!important`, pointing to:

- `./custom-backgrounds/rain-room.jpg`
- `./custom-backgrounds/miner.jpg`
- `./custom-backgrounds/campfire.jpg`
- `./custom-backgrounds/biome.jpg`

It also applies the same custom backgrounds to the Mind Reset Hub premium cards.

Important: keep the `custom-backgrounds` folder at the same root level as `index.html`.
