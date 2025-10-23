import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePage, useUpdatePage, useDeletePage, usePublishPage } from '@/hooks/usePages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LanguageSection } from '@/components/admin/LanguageSection';
import { formatSlug } from '@/lib/slugFormatter';
import { toast } from 'sonner';
import { Locale } from '@/lib/translations';
import { isDevMode } from '@/lib/adminCheck';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LANGUAGES: Locale[] = ['en', 'br', 'es'];

export default function AdminEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: page, isLoading } = usePage(id);
  const updateMutation = useUpdatePage();
  const deleteMutation = useDeletePage();
  const publishMutation = usePublishPage();
  
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<Record<Locale, 'file' | 'manual'>>({
    en: 'manual',
    br: 'manual',
    es: 'manual',
  });
  
  const [translations, setTranslations] = useState<Record<Locale, {
    title: string;
    meta_description: string;
    content: string;
  }>>({
    en: { title: '', meta_description: '', content: '' },
    br: { title: '', meta_description: '', content: '' },
    es: { title: '', meta_description: '', content: '' },
  });

  useEffect(() => {
    if (!isDevMode()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (page) {
      setSlug(page.slug);
      setCategory(page.category || '');
      
      const newTranslations: any = {
        en: { title: '', meta_description: '', content: '' },
        br: { title: '', meta_description: '', content: '' },
        es: { title: '', meta_description: '', content: '' },
      };
      
      page.translations?.forEach((t: any) => {
        newTranslations[t.language] = {
          title: t.title || '',
          meta_description: t.meta_description || '',
          content: t.content || '',
        };
      });
      
      setTranslations(newTranslations);
    }
  }, [page]);

  const handleSlugBlur = () => {
    setSlug(formatSlug(slug));
  };

  const handleTranslationChange = (lang: Locale, field: string, value: string) => {
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
        .filter(([_, t]) => t.title)
        .map(([lang, t]) => ({
          language: lang as Locale,
          ...t,
        }));
      
      await updateMutation.mutateAsync({
        id: id!,
        slug,
        category: category && category !== 'none' ? category : null,
        translations: translationsToSave,
      });
      
      toast.success('Page updated successfully');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating page:', error);
      toast.error('Failed to update page');
    }
  };

  const handlePublish = async () => {
    try {
      await publishMutation.mutateAsync(id!);
      toast.success('Page published successfully');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to publish page');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(id!);
      toast.success('Page deleted successfully');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  if (!isDevMode()) {
    return null;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Page</h1>
        
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
            <p className="text-sm text-muted-foreground mt-1">
              Full URL: <span className="font-mono">/publications/{slug || 'your-slug-here'}</span>
            </p>
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
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            {page?.status === 'draft' && (
              <Button 
                type="button" 
                onClick={handlePublish}
                disabled={publishMutation.isPending}
              >
                Publish Now
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">Delete Page</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the page and all its translations.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </div>
  );
}
