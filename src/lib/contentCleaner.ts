/**
 * Utility functions to clean and sanitize HTML content before rendering
 */

/**
 * Unescape HTML entities that were incorrectly escaped during storage
 */
export function unescapeHTMLEntities(html: string): string {
  if (!html) return '';
  
  // Use textarea trick for safe unescaping
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

/**
 * Remove document-level wrapper tags (DOCTYPE, html, head, body)
 */
export function stripDocumentWrappers(html: string): string {
  if (!html) return '';
  
  // Parse the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Try to find main content area
  const contentElement = doc.querySelector('article, main, [role="main"], .article-content, .post-content');
  
  if (contentElement) {
    return contentElement.innerHTML;
  }
  
  // If no specific container, return body content
  return doc.body.innerHTML || html;
}

/**
 * Clean HTML content before rendering - handles escaped entities and document wrappers
 */
export function cleanContentForRendering(content: string | null): string {
  if (!content) return '';
  
  let cleanedContent = content;
  
  // Step 1: Check if content has escaped HTML entities
  if (cleanedContent.includes('&lt;') || cleanedContent.includes('&gt;')) {
    cleanedContent = unescapeHTMLEntities(cleanedContent);
  }
  
  // Step 2: Check if content has document-level wrappers
  if (
    cleanedContent.includes('<!DOCTYPE') || 
    cleanedContent.includes('<html') || 
    cleanedContent.includes('<head>') ||
    (cleanedContent.includes('<body') && cleanedContent.includes('</body>'))
  ) {
    cleanedContent = stripDocumentWrappers(cleanedContent);
  }
  
  // Step 3: Remove word processor wrapper classes
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cleanedContent;
  
  tempDiv.querySelectorAll('[class^="p"], [class^="s"]').forEach(el => {
    const className = el.getAttribute('class');
    if (className && /^[ps]\d+$/.test(className)) {
      el.removeAttribute('class');
    }
  });
  
  return tempDiv.innerHTML;
}

/**
 * Validate and warn about content issues in admin
 */
export function validateContentStructure(content: string): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!content) {
    return { isValid: false, warnings: ['Content is empty'] };
  }
  
  // Check for escaped HTML
  if (content.includes('&lt;') || content.includes('&gt;')) {
    warnings.push('Content contains escaped HTML entities (will be automatically fixed on render)');
  }
  
  // Check for document-level tags
  if (content.includes('<!DOCTYPE') || content.includes('<html')) {
    warnings.push('Content contains full HTML document structure (will be automatically extracted on render)');
  }
  
  // Check for word processor markup
  if (content.includes('class="p1"') || content.includes('class="s1"')) {
    warnings.push('Content contains word processor formatting (will be cleaned on render)');
  }
  
  // Check content length
  if (content.length < 100) {
    warnings.push('Content appears very short (less than 100 characters)');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
}
