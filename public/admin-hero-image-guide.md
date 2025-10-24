# Hero Image Management Guide

## Overview
The admin panel now supports hero image uploads for blog posts and pages. This guide explains how to use this feature.

## Features

### 1. Creating a New Page
When creating a new page in `/admin/new`:
- **Hero Image Upload**: Drag & drop or click to upload an image
- **Supported Formats**: JPG, PNG, WEBP
- **Max File Size**: 2MB
- **Recommended Dimensions**: 1200x630px (optimal for social sharing)
- **Read Time**: Add custom read time (e.g., "5 min read", "8 min de leitura")

### 2. Editing an Existing Page
When editing a page in `/admin/edit/:id`:
- **Preview**: See the current hero image
- **Change Image**: Click "Change Image" to upload a new one
- **Remove Image**: Click the X button to delete the current image
- **Read Time**: Update or add read time

### 3. Translation Management
When editing translations in `/admin/edit/:id/:lang`:
- **Shared Image**: By default, all language versions share the same hero image
- **Alt Text**: Add language-specific alt text for accessibility
- **Localized Alt Text**: Each language can have its own descriptive alt text

## Best Practices

### Image Specifications
- **Dimensions**: 1200x630px is ideal for social media sharing (OG image)
- **Aspect Ratio**: 16:9 or 1.91:1 works well
- **File Size**: Keep under 1MB when possible for faster loading
- **Quality**: Use high-quality images but optimize before uploading

### Alt Text Guidelines
- Be descriptive but concise (max 200 characters)
- Describe what's in the image, not just the title
- Translate alt text for each language version
- Include key information visible in the image

### Examples:
- **English**: "Gabriel Mangabeira swimming butterfly stroke at Olympic competition"
- **Portuguese**: "Gabriel Mangabeira nadando borboleta em competição olímpica"
- **Spanish**: "Gabriel Mangabeira nadando mariposa en competición olímpica"

## Storage
- Images are stored in Supabase Storage bucket: `blog-images`
- Images are publicly accessible via CDN
- Each image gets a unique filename to prevent conflicts
- Old images are automatically removed when replaced

## Security
- Only authenticated admin users can upload/manage images
- File type validation (only images allowed)
- File size limit enforced (2MB max)
- Images are scanned for security issues

## Troubleshooting

### Image Not Uploading
- Check file size (must be under 2MB)
- Verify file format (JPG, PNG, or WEBP only)
- Ensure stable internet connection
- Try a different browser if issues persist

### Image Not Displaying
- Clear browser cache
- Check if image URL is valid
- Verify the page has been saved/published
- Ensure RLS policies are correctly configured

## Future Enhancements
- Language-specific hero images (currently in development)
- Image editing tools (crop, resize, filters)
- AI-generated alt text suggestions
- Batch upload for multiple images
