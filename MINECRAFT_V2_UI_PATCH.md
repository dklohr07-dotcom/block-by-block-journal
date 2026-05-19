# Minecraft V2 UI Patch

## Files added
- `shared/minecraft-v2-theme.css` — dark Minecraft inventory theme, 3D pixel buttons, hotbar hover/focus states, modular cards, chat toasts, XP/rating/loading helpers, responsive navigation.
- `shared/minecraft-v2-ui.js` — chat-style toast fallback, accessible keyboard activation for clickable UI slots, and startup quest notification.

## HTML changes
Each HTML page now includes the theme layer before `</head>`:

```html
<link rel="stylesheet" href="shared/minecraft-v2-theme.css"/>
```

Pages inside `realms/` use:

```html
<link rel="stylesheet" href="../shared/minecraft-v2-theme.css"/>
```

Each page also includes the UX script before `</body>`:

```html
<script src="shared/minecraft-v2-ui.js"></script>
```

Pages inside `realms/` use:

```html
<script src="../shared/minecraft-v2-ui.js"></script>
```

## CSS design system implemented
- Background: `#242424` with subtle block-grid overlays.
- Borders: thick pixelated borders using `#383838`.
- Buttons/forms: raised 3D Minecraft effect with cyan/lime hotbar hover states.
- Layout: inventory-style responsive grid for cards/features/plans/realm menus.
- Panels: stone/wood-inspired repeating textures via CSS gradients.
- Typography: pixel heading font with classic dark drop shadow.
- UX: chat-style toasts, XP bar helper, heart/rating helper, and pixel loader helper.

## Run locally
```bash
npm install
npm run dev
```
