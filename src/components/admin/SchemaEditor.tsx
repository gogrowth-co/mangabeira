import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Code, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface SchemaEditorProps {
  schema: object | null;
  onChange: (schema: object | null) => void;
  articleTitle?: string;
  articleUrl?: string;
}

const SCHEMA_TEMPLATES = {
  article: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '',
    description: '',
    author: {
      '@type': 'Person',
      name: 'Gabriel Mangabeira'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Gabriel Mangabeira',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mangabeira.net/og-mangabeira.png'
      }
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString()
  },
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Gabriel Mangabeira',
    jobTitle: 'Growth Marketing & Web3 Strategist',
    url: 'https://mangabeira.net',
    sameAs: [
      'https://linkedin.com/in/mangabeira',
      'https://x.com/manga82',
      'https://medium.com/@mangabeira'
    ]
  },
  breadcrumb: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://mangabeira.net'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Article Title',
        item: 'https://mangabeira.net/article-slug'
      }
    ]
  }
};

export function SchemaEditor({ schema, onChange, articleTitle, articleUrl }: SchemaEditorProps) {
  const [jsonText, setJsonText] = useState(() => 
    schema ? JSON.stringify(schema, null, 2) : ''
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  const validateAndUpdate = (text: string) => {
    setJsonText(text);
    
    if (!text.trim()) {
      setValidationError(null);
      setIsValid(true);
      onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      setValidationError(null);
      setIsValid(true);
      onChange(parsed);
    } catch (error) {
      setValidationError((error as Error).message);
      setIsValid(false);
    }
  };

  const applyTemplate = (templateKey: keyof typeof SCHEMA_TEMPLATES) => {
    const template: any = { ...SCHEMA_TEMPLATES[templateKey] };
    
    // Auto-fill with article data if available
    if (templateKey === 'article' && articleTitle) {
      template.headline = articleTitle;
      template.description = articleTitle;
    }
    
    if (templateKey === 'breadcrumb' && articleTitle && articleUrl) {
      template.itemListElement[1].name = articleTitle;
      template.itemListElement[1].item = articleUrl;
    }

    const formattedJson = JSON.stringify(template, null, 2);
    validateAndUpdate(formattedJson);
    toast.success(`${templateKey} template applied`);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      validateAndUpdate(formatted);
      toast.success('JSON formatted');
    } catch (error) {
      toast.error('Invalid JSON - cannot format');
    }
  };

  const clearSchema = () => {
    validateAndUpdate('');
    toast.info('Schema cleared');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          JSON-LD Schema Markup
        </CardTitle>
        <CardDescription>
          Add structured data for better SEO and rich search results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Templates */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyTemplate('article')}
            >
              Article
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyTemplate('person')}
            >
              Person
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyTemplate('breadcrumb')}
            >
              Breadcrumb
            </Button>
          </div>
        </div>

        {/* JSON Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="schema-json">JSON-LD Code</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={formatJson}
                disabled={!jsonText.trim()}
              >
                <Code className="h-4 w-4 mr-1" />
                Format
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearSchema}
                disabled={!jsonText.trim()}
              >
                Clear
              </Button>
            </div>
          </div>
          <Textarea
            id="schema-json"
            value={jsonText}
            onChange={(e) => validateAndUpdate(e.target.value)}
            placeholder='{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Your article title"\n}'
            className="font-mono text-sm min-h-[300px]"
          />
        </div>

        {/* Validation Feedback */}
        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Invalid JSON:</strong> {validationError}
            </AlertDescription>
          </Alert>
        )}

        {isValid && jsonText.trim() && !validationError && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Valid JSON-LD schema
            </AlertDescription>
          </Alert>
        )}

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          Learn more about schema markup at{' '}
          <a
            href="https://schema.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            schema.org
          </a>
          {' '}and{' '}
          <a
            href="https://developers.google.com/search/docs/appearance/structured-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Google's structured data guide
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
