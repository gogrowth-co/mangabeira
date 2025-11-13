import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePage } from '@/hooks/usePages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LanguageSection } from '@/components/admin/LanguageSection';
import { HeroImageUpload } from '@/components/admin/HeroImageUpload';
import { formatSlug } from '@/lib/slugFormatter';
import { toast } from 'sonner';
import { Locale } from '@/lib/translations';
import { useAuth } from '@/contexts/AuthContext';

const LANGUAGES: Locale[] = ['en', 'br', 'es'];

export default function AdminNew() {
  const navigate = useNavigate();
  const createMutation = useCreatePage();
  const { user, isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return null;
  }
  
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [readTime, setReadTime] = useState('');
  const [inputMethod, setInputMethod] = useState<Record<Locale, 'file' | 'manual'>>({
    en: 'file',
    br: 'file',
    es: 'file',
  });
  
  const [translations, setTranslations] = useState<Record<Locale, {
    title: string;
    meta_description: string;
    content: string;
    schema?: object | null;
  }>>({
    en: { title: '', meta_description: '', content: '', schema: null },
    br: { title: '', meta_description: '', content: '', schema: null },
    es: { title: '', meta_description: '', content: '', schema: null },
  });

  const handleSlugBlur = () => {
    setSlug(formatSlug(slug));
  };

  const handleTranslationChange = (lang: Locale, field: string, value: string | object | null) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug) {
      toast.error('Slug is required');
      return;
    }
    
    if (!translations.en.title) {
      toast.error('English title is required');
      return;
    }
    
    try {
      const translationsToSave = Object.entries(translations)
        .filter(([_, t]) => t.title) // Only save translations with titles
        .map(([lang, t]) => ({
          language: lang as Locale,
          ...t,
        }));
      
      await createMutation.mutateAsync({
        slug,
        category: category && category !== 'none' ? category : null,
        featured_image: featuredImage,
        read_time: readTime || null,
        translations: translationsToSave,
      });
      
      toast.success('Page created successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating page:', error);
      toast.error('Failed to create page');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Page</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={handleSlugBlur}
              placeholder="my-page-url"
              required
            />
          </div>
          
          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Hero Image */}
          <HeroImageUpload
            currentImage={featuredImage}
            onImageChange={setFeaturedImage}
          />
          
          {/* Read Time */}
          <div>
            <Label htmlFor="read-time">Read Time (optional)</Label>
            <Input
              id="read-time"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g., 8 min read"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: "5 min read", "10 minutos de lectura"
            </p>
          </div>
          
          {/* Language Sections */}
          <div>
            <Label>Content by Language</Label>
            <Accordion type="multiple" className="mt-2">
              {LANGUAGES.map((lang) => (
                <AccordionItem key={lang} value={lang}>
                  <AccordionTrigger>
                    {lang === 'en' ? '🇺🇸 English *' : lang === 'br' ? '🇧🇷 Brazilian Portuguese' : '🇪🇸 Spanish'}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <LanguageSection
                      language={lang}
                      translation={translations[lang]}
                      inputMethod={inputMethod[lang]}
                      onTranslationChange={(field, value) => handleTranslationChange(lang, field, value)}
                      onInputMethodChange={(method) => setInputMethod(prev => ({ ...prev, [lang]: method }))}
                      required={lang === 'en'}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
