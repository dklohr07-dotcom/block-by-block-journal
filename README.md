# Mind Reset Hub

A Minecraft-themed mental wellness mini-app with 9 interactive sections designed to help users de-stress, manage anxiety, and build confidence.

## Features

### Free Sections
| Section | Experience |
|---|---|
| 💎 Diamond Mind Reset | Light up a pixel heart — each click reveals an affirmation |
| 🧊 Breathing Blocks | Box breathing with an animated 3D Minecraft cube |
| ⛏ Thought Miner Cave | CBT-style thought reframing exercise |
| 🔥 Campfire Reflection | Guided journaling prompts with animated fire |
| 🌲 Forest Whisper | 5-4-3-2-1 grounding exercise + nature poems |
| 🌅 Sunset Reset | Gratitude journaling + day rating |

### Premium Sections
| Section | Experience |
|---|---|
| 🌧️ Rain Room Realm | Interactive rain canvas with adjustable intensity/speed/wind + meditation guides |
| 🌀 Biome Shift Portal | Perspective-shifting affirmations per biome (Mountain, Ocean, Desert, Space) |
| 💎 Deep Cave Calm | Mood check-in with personalized coping toolkit |

## Setup

No build step required. Just open `index.html` in a browser, or serve with any static file server:

```bash
# Python
python3 -m http.server 8080

# Node.js (npx)
npx serve .
```

## File Structure

```
mind-reset-hub/
├── index.html              # Main entry point
├── css/
│   └── styles.css          # All styles (Minecraft dark theme)
├── js/
│   ├── stars.js            # Animated starfield background
│   ├── app.js              # Section routing & navigation
│   └── sections/
│       ├── diamond.js      # Diamond Mind Reset
│       ├── breathing.js    # Breathing Blocks
│       ├── thought.js      # Thought Miner Cave
│       ├── campfire.js     # Campfire Reflection
│       ├── forest.js       # Forest Whisper
│       ├── sunset.js       # Sunset Reset
│       ├── rain.js         # Rain Room Realm
│       ├── biome.js        # Biome Shift Portal
│       └── deep.js         # Deep Cave Calm
└── README.md
```

## Design System

- **Fonts**: Press Start 2P (headers), VT323 (body text), Silkscreen (labels)
- **Colors**: Deep navy backgrounds, cyan/blue free accents, gold premium accents
- **Aesthetic**: Minecraft pixel art + dark cosmic space theme
- **Mobile**: Fully responsive, touch-friendly

## Integration

To embed in an existing app, either:
1. Drop these files into a subfolder and link to `index.html`
2. Copy individual section JS functions into your framework
3. Import the CSS variables into your existing stylesheet

The hub uses vanilla JS with no dependencies — zero npm installs required.
