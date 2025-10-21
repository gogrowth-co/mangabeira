export interface ParsedHTML {
  title: string;
  metaDescription: string;
  content: string;
}

export function parseHTMLFile(htmlContent: string): ParsedHTML {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Extract title from <title> or first <h1>
  const title = 
    doc.querySelector('title')?.textContent?.trim() || 
    doc.querySelector('h1')?.textContent?.trim() || 
    'Untitled';
  
  // Extract meta description
  const metaDescription = 
    doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  
  // Extract body content
  const content = doc.body.innerHTML;
  
  return { title, metaDescription, content };
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
