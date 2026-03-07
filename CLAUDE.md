# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Starpath is a SvelteKit 5 web application for reading markdown chapters fetched from a GitHub repository. The app provides a customizable reading experience with user-configurable fonts, colors, and text sizes that persist in localStorage.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Type checking in watch mode
npm run check:watch
```

## Architecture

### Data Flow

The application fetches markdown content from the GitHub repository `ishyv/starpath` at runtime:

1. **Root layout server** (`src/routes/+layout.server.ts`):
   - Fetches the list of chapters from `chapters/` folder via GitHub API
   - Extracts chapter IDs from filenames (format: `Capitulo <id>.md`)
   - Extracts titles from the first line of each markdown file
   - Returns `id_and_titles` array to populate the index

2. **Chapter page server** (`src/routes/read/[id]/+page.server.ts`):
   - Fetches raw markdown content for a specific chapter by ID
   - Uses `marked` library to convert markdown to HTML
   - Strips Obsidian-style links (`[[...]]`)
   - Returns rendered HTML content

### State Management

The app uses Svelte 5 stores for client-side state:

- **`user_config`** (`src/lib/stores/user_config.ts`): Manages user appearance preferences
  - Font family (from predefined FONTS array)
  - Font size (8-32px)
  - Background and text colors (CSS-valid values)
  - Color history (last 5 used colors for each)
  - Automatically syncs with localStorage
  - Includes `ColorHistory` class for managing recent color selections

- **`last_chapter_id`** (`src/lib/stores/last_chapter_id.ts`): Hardcoded value tracking the last available chapter (currently 4)
  - **Note**: This is marked as "horrible" and should be dynamically determined

### Routing Structure

- `/` - Index page listing all chapters
- `/read/[id]` - Chapter reader page (accepts numeric or alphanumeric IDs like "0", "1", "A0")
- `/settings` - User configuration page

### Key Components

- **`ConfigNav.svelte`**: Navigation bar with home and settings icons
  - Conditionally shows home icon based on `home` prop
  - Uses FontAwesome icons via `svelte-fa`

- **`PageControl.svelte`**: Previous/Next chapter navigation
  - Conditionally renders based on current chapter ID and `last_chapter_id`
  - Appends `#` to URLs to force page scroll to top

- **`RecentColors.svelte`**: Displays color history for quick access

- **`SettingSection.svelte`** & **`SettingsLayout.svelte`**: Layout components for settings page

### Styling

- Uses **Tailwind CSS 4.0** via `@tailwindcss/vite` plugin
- Custom transition effect: `swipe` transition in `+layout.svelte` animates page changes
- User configuration dynamically applies inline styles to the main element
- Global markdown styles in `/read/[id]/+page.svelte` for rendered HTML content

## Important Implementation Notes

### Chapter ID Handling

The app supports both numeric and alphanumeric chapter IDs (e.g., "4", "A0"). When adding chapter ID logic:
- Extract IDs from filenames using: `file.name.split(" ").at(-1).replace(".md", "")`
- Chapter filenames must follow the pattern: `Capitulo <id>.md`

### User Configuration Updates

When updating `user_config`, use the `update` method pattern:
```typescript
user_config.update((config) => {
  config.property = newValue;
  return config;
});
```

For restoring defaults, use spread syntax to force reactivity:
```typescript
user_config.update(() => ({ ...default_value }));
```

### ColorHistory Class

When working with color history, remember it's a class instance (not a plain array):
- Use `.push(value)` to add colors
- Automatically maintains the limit and deduplicates
- Serializes to JSON array for localStorage
- Must be reconstructed from array when loading from localStorage

### Known Issues

- `last_chapter_id` is hardcoded (see `src/lib/stores/last_chapter_id.ts:3-4`)
  - Should be dynamically determined from the GitHub API response
  - Currently requires manual updates when new chapters are added
