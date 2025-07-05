# Adding Hero Images for Slider

To complete the hero slider functionality, you need to add two additional hero images to your `images/` directory:

## Required Images

1. **hero-image.jpg** (already exists)
   - Current hero image
   - Used for Boho Chic collection

2. **hero-image-2.jpg** (needs to be added)
   - Second hero image
   - Should represent Cozy Coastal collection
   - Recommended size: 1920x1080 or higher
   - Format: JPG, PNG, or WebP

3. **hero-image-3.jpg** (needs to be added)
   - Third hero image
   - Should represent Instrument collection
   - Recommended size: 1920x1080 or higher
   - Format: JPG, PNG, or WebP

## Image Guidelines

### Content Suggestions
- **hero-image-2.jpg**: Coastal-inspired fashion photography, beach settings, or ocean-themed designs
- **hero-image-3.jpg**: Musical instrument-inspired designs, elegant evening wear, or sophisticated black/white photography

### Technical Requirements
- **Resolution**: Minimum 1920x1080, preferably 2560x1440 or higher
- **Aspect Ratio**: 16:9 or similar landscape orientation
- **File Size**: Optimize for web (under 500KB each)
- **Format**: JPG for photos, PNG for graphics with transparency

### Styling Consistency
- Maintain the same color grading and mood as the existing hero image
- Ensure good contrast for white text overlay
- Consider the existing brightness/contrast filters applied in CSS

## Quick Setup

1. Add your images to the `images/` directory
2. Name them exactly: `hero-image-2.jpg` and `hero-image-3.jpg`
3. Test the slider functionality
4. Adjust image positioning if needed using CSS `object-position`

## Alternative: Use Existing Images

If you don't have additional hero images yet, you can temporarily use:
- Portfolio preview images from `assets/portfolios/`
- Other fashion photography you have
- Stock photography (ensure proper licensing)

## Testing the Slider

Once images are added:
1. Refresh the page
2. Check that dots appear at the bottom
3. Click dots to navigate between slides
4. Use arrow keys for keyboard navigation
5. Test touch/swipe on mobile devices
6. Verify autoplay functionality (5-second intervals) 