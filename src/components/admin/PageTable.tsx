import { useState } from 'react';
import { usePages, usePublishPage } from '@/hooks/usePages';
import { LanguageBadge } from './LanguageBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Locale } from '@/lib/translations';

export function PageTable() {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const navigate = useNavigate();
  const { data: pages, isLoading } = usePages(filter);
  const publishMutation = usePublishPage();

  const handlePublish = async (id: string) => {
    try {
      await publishMutation.mutateAsync(id);
      toast.success('Page published successfully');
    } catch (error) {
      toast.error('Failed to publish page');
    }
  };

  const getEnglishTitle = (page: any) => {
    const enTranslation = page.translations?.find((t: any) => t.language === 'en');
    return enTranslation?.title || 'Untitled';
  };

  const hasTranslation = (page: any, lang: Locale) => {
    return page.translations?.some((t: any) => t.language === lang);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="border rounded-lg overflow-hidden bg-background">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Languages</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Updated</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages?.map((page) => (
              <tr key={page.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3 text-sm">{getEnglishTitle(page)}</td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">/{page.slug}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {(['en', 'br', 'es'] as Locale[]).map((lang) => (
                      <LanguageBadge
                        key={lang}
                        language={lang}
                        hasTranslation={hasTranslation(page, lang)}
                        onClick={() => navigate(`/admin/edit/${page.id}/${lang}`)}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={page.status === 'published' ? 'default' : 'secondary'}
                    className={page.status === 'published' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}>
                    {page.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/edit/${page.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {page.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(page.id)}
                        disabled={publishMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {pages?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pages found
          </div>
        )}
      </div>
    </div>
  );
}
