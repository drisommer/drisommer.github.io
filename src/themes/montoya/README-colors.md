# Theme Color Configuration

This document explains how to customize the colors of the Montoya theme through the `hugo.toml` configuration file.

## Available Color Parameters

The following color parameters can be configured in the `hugo.toml` file under the `[params.colors]` section:

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

## How to Customize Colors

To change the theme colors, simply edit the values in the `hugo.toml` file. Here's what each color parameter affects:

- **accentColor**: The main accent color used for highlights, buttons, cursor, and other interactive elements.
- **darkBackground**: The background color for dark sections and main content areas with a dark theme.
- **lightBackground**: The background color for light sections.
- **darkText**: The color for text on light backgrounds.
- **lightText**: The color for text on dark backgrounds.
- **lightText**: A lighter gray color used for some background elements.
- **darkText**: A darker gray color used for some UI elements and backgrounds.
- **lightText**: The color used for paragraph text throughout the site.

## Example Customization

Here's an example of how you could change the theme to use a blue color scheme:

```toml
[params.colors]
  accentColor = "#3498db"       # Blue accent color
  darkBackground = "#1a1a2e"     # Dark blue-black
  lightBackground = "#f5f9fc"    # Light blue-white
  darkText = "#16213e"           # Dark blue-black text
  lightText = "#ffffff"          # White text
  lightText = "#e5f0fb"          # Light blue-gray
  darkText = "#2c3e50"           # Dark blue-gray
  lightText = "#7f8c8d"     # Medium gray for paragraphs
```

After making changes to the colors in `hugo.toml`, rebuild your site to see the changes take effect.

## Technical Implementation Details

The color system is implemented using several techniques to ensure maximum compatibility:

1. **CSS Variables**: All colors are defined as CSS variables in the `:root` selector in the `baseof.html` file.

2. **data-bgcolor Attributes**: These are used throughout the HTML templates to apply background colors to sections.

3. **JavaScript Enhancement**: A `theme-colors.js` script helps apply colors dynamically, especially for elements that use animations or are dynamically created.

4. **Default Fallbacks**: All color variables include fallbacks to the original theme colors in case the configuration is missing.

5. **RGB Color Values**: For advanced styling with opacity, RGB versions of colors are automatically calculated and available as CSS variables.

### Styled Components

The following components now use the theme colors:

- Page backgrounds and sections
- Button styles and hover effects 
- Project filters with active/hover states
- Marquee sections
- Contact page elements (icons, text)
- About page components
- Custom cursor
- Link hover states
- Curtain effects for project items

## Components Affected by Theme Colors

The following components have been updated to use the theme color system:

- Navigation and menus
- Buttons and interactive elements
- Section backgrounds
- Text elements
- Project filters and listings
- Video heroes and overlay gradients
- Contact form elements
- Services section
- Awards galleries and lists
### Team Members Section

The team members section uses theme colors for:

- Member names (uses `--light-text` by default)
- Role and since dates (uses `--light-text`)
- Hover effects (uses `--accent-color` when hovering over names)
- Border colors between members (uses rgba versions of text colors)

### Moving Gallery Component

The client logos carousel in the about page uses theme colors for:

- Caption text (uses `--light-text` by default)
- Hover effects on captions (changes to `--accent-color` on hover)
- Background color of the section (uses `--dark-background`)
- Image hover effects (slight opacity change on hover)

Each of these components will automatically adopt your color choices from the `hugo.toml` configuration.

### Implementation in Template Files

Template files use the color variables like this:

```html
<section data-bgcolor="{{ .Site.Params.colors.darkBackground | default "#0c0c0c" }}">
  <!-- Content goes here -->
</section>
```

### CSS Implementation

In CSS files, the colors are used through CSS variables:

```css
.button:hover {
  background-color: var(--accent-color);
  color: var(--light-text);
}
```

## Theme Color Test Page

A test page has been created to visualize all theme colors and ensure they're applied correctly. You can view this page at `/color-test/` on your site.

## Testing Your Colors

After changing the colors in `hugo.toml`, you should check:

1. Text legibility on all background colors
2. Button states (normal, hover, active)
3. Section transitions and animations
4. Form elements and input fields
5. Navigation elements

### Quick Testing Command

To quickly preview your color changes, run the Hugo server:

```bash
cd your-site-directory && hugo server
```

Then visit http://localhost:1313 in your browser to see the changes in real-time.

### Test Page

You can create a quick test page that showcases all theme elements with your color scheme:

1. Create a new file at `content/color-test.md`
2. Add the following content:

```markdown
---
title: "Color Scheme Test"
layout: color-test
---

This page tests all theme elements with the current color scheme.
```

3. Create a corresponding layout template at `layouts/_default/color-test.html` 
   that includes all UI elements to test your color scheme.

## Troubleshooting

If your color changes aren't visible:

1. Make sure you've rebuilt your site after changing `hugo.toml`
2. Clear your browser cache
3. Check browser console for any JavaScript errors
4. Verify that the `theme-colors.js` file is being loaded properly
5. Check that the color values in `hugo.toml` are valid hex colors (e.g., `#ffffff`, not `white`)

## Best Practices

- Ensure good contrast between text and background colors for accessibility.
- Keep a consistent color palette across your site for a professional look.
- Consider using a color wheel tool to choose complementary or analogous colors.
- Test your color scheme in both light and dark environments.
- Use a color contrast checker to ensure text remains readable (WCAG AA standards recommend a minimum contrast ratio of 4.5:1 for normal text).
