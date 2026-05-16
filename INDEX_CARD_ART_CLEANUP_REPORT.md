# Index Card Art Cleanup Report

I found the old Mind Reset Hub card artwork in `index.html`. In this version, it was not named `art-rain` or `realm-art`; it was mainly the `.reset-card-icon` emoji/icon layer inside each Premium card, plus possible generated `::before` / `::after` artwork layers.

## Removed from Premium cards

- `🌧️` Rain Room Realm icon
- `⛏️` Thought Miner Cave icon
- `🔥` Campfire Reflection icon
- `🌄` Biome Shift Portal icon

## Added CSS protection

Added a final CSS cleanup section at the end of the main `<style>` block:

- hides `.reset-card-icon` in `#resetHub`
- disables old `::before` and `::after` generated art layers on reset cards
- keeps card text readable above the custom image backgrounds
- targets cards by `onclick` instead of `nth-of-type`, so the correct custom background attaches to the correct section

## Custom backgrounds now target

- `rainRoom` → `./custom-backgrounds/rain-room.jpg`
- `thoughtMiner` → `./custom-backgrounds/miner.jpg`
- `campfire` → `./custom-backgrounds/campfire.jpg`
- `biomeShift` → `./custom-backgrounds/biome.jpg`
