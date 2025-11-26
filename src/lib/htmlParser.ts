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

function cleanHTMLContent(doc: Document): string {
  // Clone the body to avoid modifying the original
  const bodyClone = doc.body.cloneNode(true) as HTMLElement;
  
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
  ];
  
  unwantedSelectors.forEach(selector => {
    bodyClone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  // Remove empty paragraphs and divs
  bodyClone.querySelectorAll('p, div').forEach(el => {
    if (!el.textContent?.trim()) {
      el.remove();
    }
  });
  
  return bodyClone.innerHTML.trim();
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
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  const warnings: string[] = [];
  
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
