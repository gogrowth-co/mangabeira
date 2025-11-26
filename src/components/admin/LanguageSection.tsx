import { Locale } from '@/lib/translations';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { readHTMLFile } from '@/lib/htmlParser';
import { formatSlug } from '@/lib/slugFormatter';
import { toast } from 'sonner';
import { Upload, X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { SchemaEditor } from './SchemaEditor';

interface LanguageSectionProps {
  language: Locale;
  translation: {
    title: string;
    meta_description: string;
    content: string;
    slug?: string;
    schema?: object | null;
  };
  inputMethod: 'file' | 'manual';
  onTranslationChange: (field: string, value: string | object | null) => void;
  onInputMethodChange: (method: 'file' | 'manual') => void;
  required?: boolean;
  baseSlug?: string;
}

const FLAGS: Record<Locale, string> = {
  en: '🇺🇸',
  br: '🇧🇷',
  es: '🇪🇸',
};

const NAMES: Record<Locale, string> = {
  en: 'English',
  br: 'Brazilian Portuguese',
  es: 'Spanish',
};

export function LanguageSection({
  language,
  translation,
  inputMethod,
  onTranslationChange,
  onInputMethodChange,
  required,
  baseSlug,
}: LanguageSectionProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(html|htm)$/i)) {
      toast.error('Please upload an HTML file (.html or .htm)');
      return;
    }

    try {
      const parsed = await readHTMLFile(file);
      
      // Update all fields with parsed data
      onTranslationChange('title', parsed.title);
      onTranslationChange('meta_description', parsed.metaDescription);
      onTranslationChange('content', parsed.content);
      if (parsed.schema) {
        onTranslationChange('schema', parsed.schema);
      }
      
      // Auto-switch to manual mode so user can edit the content
      onInputMethodChange('manual');
      
      // Show success message with extraction info
      const infoMessages = [
        `Title: ${parsed.extractionInfo.titleSource}`,
        `Meta: ${parsed.extractionInfo.hasMetaDescription ? 'Found' : 'Missing'}`,
        `Schema: ${parsed.extractionInfo.hasSchema ? 'Found' : 'Not found'}`,
        `Content: ${parsed.extractionInfo.contentLength} chars`,
      ];
      
      toast.success(`File uploaded - ${infoMessages.join(' • ')}`);
      
      // Show warnings if any
      if (parsed.warnings.length > 0) {
        setTimeout(() => {
          parsed.warnings.forEach(warning => {
            toast.warning(warning);
          });
        }, 500);
      }
    } catch (error) {
      console.error('Error parsing HTML file:', error);
      toast.error('Failed to parse HTML file');
    }
  };

  const handleSlugBlur = () => {
    const currentSlug = translation.slug || '';
    if (currentSlug) {
      onTranslationChange('slug', formatSlug(currentSlug));
    }
  };

  const handleClear = () => {
    onTranslationChange('title', '');
    onTranslationChange('meta_description', '');
    onTranslationChange('content', '');
  };

  const hasContent = translation.title || translation.meta_description || translation.content;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {FLAGS[language]} {NAMES[language]} {required && '*'}
        </h3>
      </div>

      {/* Input Method Toggle */}
      <RadioGroup value={inputMethod} onValueChange={(v) => onInputMethodChange(v as 'file' | 'manual')}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id={`${language}-file`} />
            <Label htmlFor={`${language}-file`} className="cursor-pointer">Upload HTML File</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id={`${language}-manual`} />
            <Label htmlFor={`${language}-manual`} className="cursor-pointer">Manual Entry</Label>
          </div>
        </div>
      </RadioGroup>

      {/* Localized Slug - Always visible for BR and ES */}
      {language !== 'en' && baseSlug && (
        <div>
          <Label htmlFor={`${language}-slug`}>Slug (Localized)</Label>
          <Input
            id={`${language}-slug`}
            value={translation.slug || ''}
            onChange={(e) => onTranslationChange('slug', e.target.value)}
            onBlur={handleSlugBlur}
            placeholder={baseSlug}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Full URL: <span className="font-mono">
              /{language === 'br' ? 'br/artigos' : 'es/articulos'}/{translation.slug || baseSlug}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            Leave empty to use English slug. Use lowercase and hyphens only.
          </p>
        </div>
      )}

      {/* File Upload Mode */}
      {inputMethod === 'file' && (
        <div className="space-y-2">
          {!hasContent ? (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Choose an HTML file to upload
              </p>
              <Button type="button" variant="outline" asChild>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  Choose File
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Accepts .html and .htm files
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-800 dark:text-green-200">
                  ✓ Content uploaded
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Mode */}
      {inputMethod === 'manual' && (
        <div className="space-y-4">
          {/* Show helpful validation info */}
          {hasContent && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {translation.title ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-amber-600" />
                    )}
                    <span>Title: {translation.title ? 'Set' : 'Missing (required)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {translation.meta_description ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-amber-600" />
                    )}
                    <span>Meta Description: {translation.meta_description ? `${translation.meta_description.length} chars` : 'Missing (recommended)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {translation.content ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-amber-600" />
                    )}
                    <span>Content: {translation.content ? `${translation.content.length} chars` : 'Missing (required)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {translation.schema ? (
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                    ) : (
                      <Info className="h-3 w-3 text-blue-600" />
                    )}
                    <span>Schema: {translation.schema ? 'Configured' : 'Optional'}</span>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor={`${language}-title`}>Title {required && '*'}</Label>
            <Input
              id={`${language}-title`}
              value={translation.title}
              onChange={(e) => onTranslationChange('title', e.target.value)}
              required={required}
            />
          </div>

          <div>
            <Label htmlFor={`${language}-meta`}>Meta Description</Label>
            <Textarea
              id={`${language}-meta`}
              value={translation.meta_description}
              onChange={(e) => onTranslationChange('meta_description', e.target.value)}
              maxLength={160}
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {translation.meta_description.length}/160
            </p>
          </div>

          <div>
            <Label htmlFor={`${language}-content`}>
              Content {required && <span className="text-destructive">*</span>}
            </Label>
            <RichTextEditor
              content={translation.content}
              onChange={(html) => onTranslationChange('content', html)}
              placeholder={`Enter ${language.toUpperCase()} content with rich formatting`}
            />
          </div>

          {/* Schema Editor */}
          <SchemaEditor
            schema={translation.schema || null}
            onChange={(schema) => onTranslationChange('schema', schema)}
            articleTitle={translation.title}
          />
        </div>
      )}
    </div>
  );
}
