# TRMNL Nutrislice Plugin

This repository automatically fetches and parses school lunch menus from Nutrislice and serves them as a JSON payload for TRMNL displays.

## Setup Instructions

1.  **Create Repository**: Create a new repository on GitHub named `trmnl-nutrislice-plugin`.
2.  **Upload Files**: Push the contents of this directory to your new GitHub repository.
3.  **TRMNL Dashboard**:
    *   Create a new "Custom Plugin" on your TRMNL dashboard.
    *   **Data URL**: You have two ways to get your data:
        *   **Option A: Static File (Automatic)**
            *   Configure GitHub Variables `NUTRISLICE_DISTRICT` and `NUTRISLICE_SCHOOL_ID`.
            *   Enable GitHub Actions.
            *   Use the "Raw" URL of your `menu.json` file.
        *   **Option B: Dynamic API (Instant)**
            *   Deploy this repository to Vercel.
            *   Use: `https://your-project.vercel.app/api/menu?district=your-district&school=your-school-id&meal_type=lunch`
    *   **HTML Markup**: Copy the contents of `trmnl_markup.html` into the markup section.

## How it works

- **Static Mode**: The GitHub Action runs daily. It fetches the weekly menu using the Nutrislice API, simplifies it with `jq`, and commits it to `menu.json`.
- **Dynamic Mode**: The Vercel function (`api/menu.js`) fetches and parses the menu on-the-fly whenever your TRMNL device requests an update.

## License

MIT
