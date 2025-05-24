# drisommer.github.io

## Theme Customization

### Font Configuration

The theme allows for complete font customization through variables defined in `hugo.toml`. These variables control both font families and font sizes throughout the site.

#### Font Families

```toml
[params.fonts]
  primaryFont = "Poppins"
  secondaryFont = "Fredericka the Great"
```

The primary font is used for body text and general content, while the secondary font is used for hero titles and decorative elements.

#### Font Sizes

```toml
[params.fontSizes]
  # Title font sizes (vw values)
  heroTitle = "3.15"
  bigTitle = "1.1"
  h1Size = "4.15"
  h2Size = "3"
  h3Size = "2"
  h4Size = "1"
  h5Size = "0.6"
  h6Size = "18px"
  bodySize = "16px"
  smallBodySize = "15px"
  captionSize = "12px"
  # Responsive variations
  nextHeroTitle = "22.15"
```

The font sizes for headings use viewport width (vw) units to create responsive typography that scales with the screen size. Fixed-size elements use pixel values.

#### Line Heights

```toml
[params.lineHeights]
  # Line heights (vw values)
  heroLineHeight = "22"
  bigLineHeight = "7.5"
  h1LineHeight = "4.5"
  h2LineHeight = "3.5"
  h3LineHeight = "2.5"
  h4LineHeight = "1.6"
  h5LineHeight = "1.5"
  h6LineHeight = "36px"
  bodyLineHeight = "30px"
  # Responsive variations
  nextHeroLineHeight = "14.5"
  responsiveHeroLineHeight = "20.5"
  responsiveNextHeroLineHeight = "12.5"
```

#### Layout and Dimension Values

```toml
[params.layout]
  # Layout spacing (vw values)
  galleryPadding = "42"
  galleryPaddingSmall = "35"
  titleMarginLeft = "-0.6"
  minElementWidth = "3"
  
[params.dimensions]
  # Gallery item dimensions (vw values)
  galleryItemSmall = "18"
  galleryItemStandard = "22"
  galleryItemMedium = "33"
  galleryItemLarge = "44"
```

### Changing Fonts

To change the fonts, update the `primaryFont` and `secondaryFont` variables with the name of the Google Font you want to use. The theme will automatically generate the correct Google Fonts URLs.

Example:
```toml
[params.fonts]
  primaryFont = "Montserrat"
  secondaryFont = "Playfair Display"
```

Make sure the fonts are available on Google Fonts.