export interface ParsedHTML {
  title: string;
  metaDescription: string;
  content: string;
  schema: object | null;
  warnings: string[];
  extractionInfo: {
    titleSource: string;
    hasMetaDescription: boolean;
    hasSchema: boolean;
    contentLength: number;
  };
}

function unescapeHTMLEntities(html: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

function cleanHTMLContent(doc: Document): string {
  // Try to find the main article content
  let contentElement = doc.querySelector('article, main, [role="main"], .article-content, .post-content');
  
  // If no specific content container, use body
  if (!contentElement) {
    contentElement = doc.body;
  }
  
  // Clone to avoid modifying the original
  const contentClone = contentElement.cloneNode(true) as HTMLElement;
  
  // Remove unwanted elements
  const unwantedSelectors = [
    'script',
    'style',
    'noscript',
    'iframe',
    'nav',
    'header:not(.article-header)',
    'footer:not(.article-footer)',
    '.sidebar',
    '.navigation',
    '.menu',
    '.ads',
    '.advertisement',
    '#comments',
    '.social-share',
    '.social-sharing',
    'button',
    'form',
  ];
  
  unwantedSelectors.forEach(selector => {
    contentClone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  // Remove empty elements
  contentClone.querySelectorAll('p, div, span').forEach(el => {
    if (!el.textContent?.trim() && !el.querySelector('img')) {
      el.remove();
    }
  });
  
  // Remove word processor wrapper classes (p1, s1, etc.)
  contentClone.querySelectorAll('[class^="p"], [class^="s"]').forEach(el => {
    const className = el.getAttribute('class');
    if (className && /^[ps]\d+$/.test(className)) {
      // Remove the class but keep the element
      el.removeAttribute('class');
    }
  });
  
  let cleanedHTML = contentClone.innerHTML.trim();
  
  // Unescape HTML entities if they were incorrectly escaped
  if (cleanedHTML.includes('&lt;') || cleanedHTML.includes('&gt;')) {
    cleanedHTML = unescapeHTMLEntities(cleanedHTML);
  }
  
  return cleanedHTML;
}

function extractSchema(doc: Document): object | null {
  // Look for JSON-LD schema
  const schemaScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  
  for (const script of Array.from(schemaScripts)) {
    try {
      const schemaData = JSON.parse(script.textContent || '');
      // Prefer Article or BlogPosting schemas
      if (schemaData['@type'] === 'Article' || schemaData['@type'] === 'BlogPosting') {
        return schemaData;
      }
      // Return first valid schema if no article found
      if (schemaData['@type']) {
        return schemaData;
      }
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  return null;
}

function extractTitle(doc: Document): { title: string; source: string } {
  // Priority order for title extraction
  const sources = [
    { selector: 'meta[property="og:title"]', attr: 'content', name: 'Open Graph' },
    { selector: 'meta[name="twitter:title"]', attr: 'content', name: 'Twitter Card' },
    { selector: 'title', attr: null, name: 'Title Tag' },
    { selector: 'h1.article-title', attr: null, name: 'Article H1' },
    { selector: 'h1', attr: null, name: 'First H1' },
  ];
  
  for (const source of sources) {
    const element = doc.querySelector(source.selector);
    if (element) {
      const title = source.attr 
        ? element.getAttribute(source.attr)?.trim()
        : element.textContent?.trim();
      
      if (title) {
        return { title, source: source.name };
      }
    }
  }
  
  return { title: 'Untitled', source: 'Default' };
}

function extractMetaDescription(doc: Document): string {
  const sources = [
    'meta[name="description"]',
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
  ];
  
  for (const selector of sources) {
    const meta = doc.querySelector(selector);
    const description = meta?.getAttribute('content')?.trim();
    if (description) {
      return description;
    }
  }
  
  return '';
}

export function parseHTMLFile(htmlContent: string): ParsedHTML {
  // First check if content has escaped HTML entities and unescape if needed
  let processedContent = htmlContent;
  if (htmlContent.includes('&lt;') || htmlContent.includes('&gt;')) {
    processedContent = unescapeHTMLEntities(htmlContent);
  }
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(processedContent, 'text/html');
  
  const warnings: string[] = [];
  
  // Check for document-level tags
  if (processedContent.includes('<!DOCTYPE') || processedContent.includes('<html') || processedContent.includes('<body')) {
    warnings.push('Document contains full HTML structure (DOCTYPE, html, body tags) - extracting content only');
  }
  
  // Extract title
  const { title, source: titleSource } = extractTitle(doc);
  if (title === 'Untitled') {
    warnings.push('No title found in the HTML file');
  }
  
  // Extract meta description
  const metaDescription = extractMetaDescription(doc);
  const hasMetaDescription = metaDescription.length > 0;
  if (!hasMetaDescription) {
    warnings.push('No meta description found');
  }
  
  // Extract schema
  const schema = extractSchema(doc);
  const hasSchema = schema !== null;
  
  // Clean and extract body content
  const content = cleanHTMLContent(doc);
  const contentLength = content.length;
  
  if (contentLength === 0) {
    warnings.push('No content found in the HTML body');
  } else if (contentLength < 500) {
    warnings.push('Content appears to be very short (less than 500 characters)');
  }
  
  // Check for potentially problematic content
  if (htmlContent.includes('<script') && !content.includes('<script')) {
    // Scripts were removed - this is good, but inform the user
  }
  
  return {
    title,
    metaDescription,
    content,
    schema,
    warnings,
    extractionInfo: {
      titleSource,
      hasMetaDescription,
      hasSchema,
      contentLength,
    },
  };
}

export async function readHTMLFile(file: File): Promise<ParsedHTML> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const htmlContent = e.target?.result as string;
        const parsed = parseHTMLFile(htmlContent);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
