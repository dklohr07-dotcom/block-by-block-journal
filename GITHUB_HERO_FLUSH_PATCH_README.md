# GitHub Hero Flush Patch

This patch removes the desktop gap between the Minecraft chest side menu and the hero image.

## Files changed

- `shared/minecraft-v2-theme.css`

## What changed

- The desktop sidebar offset is now applied once to `.section`.
- The hero, ticker, and feature sections no longer add a second left margin.
- The home hero now starts flush against the side menu edge and fills the remaining viewport width.
- Mobile/tablet layout remains unchanged.

## Upload to GitHub

Upload/replace `shared/minecraft-v2-theme.css` in your repository, then commit the change.
