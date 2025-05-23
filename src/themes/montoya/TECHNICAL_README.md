# Montoya Theme

## Features

- Responsive design
- Portfolio showcase with filterable projects
- Customizable color scheme via hugo.toml
- Contact form
- About page with skills and team sections

## Installation

Clone this repository into your Hugo site's themes directory:

```bash
git clone https://github.com/yourusername/montoya-theme.git themes/montoya
```

Then, add the following line to your config.toml file:

```toml
theme = "montoya"
```

## Configuration

### Color Configuration

The theme features a fully customizable color system with all colors configurable through the `hugo.toml` file. The color system has been implemented throughout all components including:

- All page templates and layouts
- Navigation and interactive elements
- Project galleries and filters
- Team members listings
- Client logos/moving gallery
- Contact page elements
- Video overlays and animations

See [README-colors.md](README-colors.md) for detailed instructions on how to customize the color scheme.

Example color configuration in hugo.toml:

```toml
[params.colors]
  accentColor = "#8c6144"       # Main accent/brand color
  darkBackground = "#0c0c0c"     # Dark background color
  lightBackground = "#ffffff"    # Light background color
  darkText = "#000000"           # Dark text color
  lightText = "#ffffff"          # Light text color
  lightText = "#f9f9f9"          # Light gray background
  darkText = "#222222"           # Dark gray color
  lightText = "#999999"     # Paragraph text color
```

### Testing Your Color Scheme

The theme includes a special color test page that displays all the configured colors and UI elements. To use it:

1. Create a file at `content/color-test.md` with:
```markdown
---
title: "Color Scheme Test"
layout: color-test
---

This page tests all theme elements with the current color scheme.
```

2. Visit `/color-test/` on your site to see how your colors are applied.
