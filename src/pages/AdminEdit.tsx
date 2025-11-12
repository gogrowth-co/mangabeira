import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePage, useUpdatePage, useDeletePage, usePublishPage } from '@/hooks/usePages';
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
import { Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const { user, isAdmin, loading } = useAuth();
  const { data: page, isLoading } = usePage(id);
  
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return null;
  }
  
  const updateMutation = useUpdatePage();
  const deleteMutation = useDeletePage();
  const publishMutation = usePublishPage();
  
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [readTime, setReadTime] = useState('');
  const [inputMethod, setInputMethod] = useState<Record<Locale, 'file' | 'manual'>>({
    en: 'manual',
    br: 'manual',
    es: 'manual',
  });
  
  const [translations, setTranslations] = useState<Record<Locale, {
    title: string;
    meta_description: string;
    content: string;
    slug?: string;
  }>>({
    en: { title: '', meta_description: '', content: '' },
    br: { title: '', meta_description: '', content: '' },
    es: { title: '', meta_description: '', content: '' },
  });

  useEffect(() => {
    if (page) {
      setSlug(page.slug);
      setCategory(page.category || '');
      setFeaturedImage(page.featured_image || null);
      setReadTime(page.read_time || '');
      
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
          slug: t.slug || '',
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
        featured_image: featuredImage,
        read_time: readTime || null,
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
    if (page?.is_system_page) {
      toast.error('Cannot delete system pages');
      return;
    }
    try {
      await deleteMutation.mutateAsync(id!);
      toast.success('Page deleted successfully');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-background p-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {page?.is_system_page && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              System page - base slug cannot be modified
            </AlertDescription>
          </Alert>
        )}
        <h1 className="text-3xl font-bold mb-8">Edit Page</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug * {page?.is_system_page && "(Read-only)"}</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={handleSlugBlur}
              placeholder="my-page-url"
              disabled={page?.is_system_page}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              {page?.is_system_page ? 'System page slugs are fixed' : `Full URL: /publications/${slug || 'your-slug-here'}`}
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
                      baseSlug={slug}
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
            {!page?.is_system_page && (
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
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
