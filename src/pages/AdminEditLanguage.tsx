import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePage, useUpdatePage } from '@/hooks/usePages';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LanguageSection } from '@/components/admin/LanguageSection';
import { HeroImageUpload } from '@/components/admin/HeroImageUpload';
import { toast } from 'sonner';
import { Locale } from '@/lib/translations';
import { isDevMode } from '@/lib/adminCheck';
import { Card } from '@/components/ui/card';

export default function AdminEditLanguage() {
  const { id, lang } = useParams<{ id: string; lang: Locale }>();
  const navigate = useNavigate();
  const { data: page, isLoading } = usePage(id);
  const updateMutation = useUpdatePage();
  
  const [inputMethod, setInputMethod] = useState<'file' | 'manual'>('manual');
  const [localizedImage, setLocalizedImage] = useState<string | null>(null);
  const [imageAltText, setImageAltText] = useState('');
  const [translation, setTranslation] = useState({
    title: '',
    meta_description: '',
    content: '',
    slug: '',
  });

  useEffect(() => {
    if (!isDevMode()) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (page && lang) {
      const existingTranslation = page.translations?.find((t: any) => t.language === lang);
      if (existingTranslation) {
        setTranslation({
          title: existingTranslation.title || '',
          meta_description: existingTranslation.meta_description || '',
          content: existingTranslation.content || '',
          slug: existingTranslation.slug || '',
        });
        setImageAltText(existingTranslation.featured_image_alt || '');
      }
      // Set localized image if it exists in the page
      setLocalizedImage(page.featured_image || null);
    }
  }, [page, lang]);

  const handleTranslationChange = (field: string, value: string) => {
    setTranslation(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!translation.title) {
      toast.error('Title is required');
      return;
    }
    
    try {
      await updateMutation.mutateAsync({
        id: id!,
        translations: [{
          language: lang!,
          ...translation,
          featured_image_alt: imageAltText || null,
        }],
      });
      
      toast.success('Translation updated successfully');
      navigate(`/admin/edit/${id}`);
    } catch (error) {
      console.error('Error updating translation:', error);
      toast.error('Failed to update translation');
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
        <h1 className="text-3xl font-bold mb-8">Edit Translation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
          {/* Read-only Page Info */}
          <div className="space-y-2 p-4 bg-muted/50 rounded">
            <div>
              <Label className="text-sm text-muted-foreground">Slug</Label>
              <p className="font-mono">/{page?.slug}</p>
            </div>
            {page?.category && (
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <p>{page.category}</p>
              </div>
            )}
          </div>
          
          {/* Hero Image Info */}
          {localizedImage && (
            <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <Label className="text-sm font-semibold mb-2 block">Hero Image</Label>
              <div className="space-y-2">
                <img 
                  src={localizedImage} 
                  alt="Current hero" 
                  className="w-full max-h-48 object-cover rounded border"
                />
                <p className="text-xs text-muted-foreground">
                  Using the hero image from the main page. To change this image for all languages, edit it in the main page editor.
                </p>
                <HeroImageUpload
                  currentImage={null}
                  onImageChange={(url) => {
                    // This would be for language-specific override in future
                    toast.info('Language-specific images coming soon');
                  }}
                  altText={imageAltText}
                  onAltTextChange={setImageAltText}
                />
              </div>
            </Card>
          )}
          
          {/* Language Section */}
          <LanguageSection
            language={lang!}
            translation={translation}
            inputMethod={inputMethod}
            onTranslationChange={handleTranslationChange}
            onInputMethodChange={setInputMethod}
            required={lang === 'en'}
            baseSlug={page?.slug}
          />
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Translation'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(`/admin/edit/${id}`)}>
              Back to All Languages
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
