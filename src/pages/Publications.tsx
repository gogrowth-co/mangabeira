import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PublicationsHubSEO from '@/components/publications/PublicationsHubSEO';
import PublicationCard from '@/components/publications/PublicationCard';
import { usePublications, useFeaturedPublications } from '@/hooks/usePublications';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Publications() {
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  
  const { data: publications = [], isLoading } = usePublications(locale, categoryFilter, searchQuery);
  const { data: featured = [] } = useFeaturedPublications(locale);
  
  // Get unique categories from publications
  const categories = ['all', ...Array.from(new Set(publications.map(p => p.category)))];
  
  // Sort publications
  const sortedPublications = [...publications].sort((a, b) => {
    if (sortOrder === 'recent') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    } else if (sortOrder === 'popular') {
      return b.view_count - a.view_count;
    } else {
      const aTitle = a.translations.find(t => t.language === locale)?.title || '';
      const bTitle = b.translations.find(t => t.language === locale)?.title || '';
      return aTitle.localeCompare(bTitle);
    }
  });
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <>
      <PublicationsHubSEO locale={locale} publicationCount={publications.length} />
      <Header locale={locale} />
      
      <main className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <a href={locale === 'en' ? '/' : `/${locale}`} className="hover:text-primary">
                {t('publications_hub', 'breadcrumb_home', locale)}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              {t('publications_hub', 'breadcrumb_current', locale)}
            </li>
          </ol>
        </nav>
        
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white-pure py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-hero text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-shadow-hero">
              {t('publications_hub', 'hero_title', locale)}
            </h1>
            <p className="text-xl text-white-soft max-w-3xl mb-6">
              {t('publications_hub', 'hero_subtitle', locale)}
            </p>
            <p className="text-base text-white-soft max-w-4xl leading-relaxed">
              {t('publications_hub', 'hero_intro', locale)}
            </p>
          </div>
        </section>
        
        {/* Featured Publications */}
        {featured.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-hero text-3xl font-bold mb-2">
              {t('publications_hub', 'featured_title', locale)}
            </h2>
            <p className="text-muted-foreground mb-8">
              {t('publications_hub', 'featured_subtitle', locale)}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map(pub => (
                <PublicationCard key={pub.id} publication={pub} locale={locale} />
              ))}
            </div>
          </section>
        )}
        
        {/* Search & Filters */}
        <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-y border-border py-6 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('publications_hub', 'search_placeholder', locale)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Sort */}
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t('publications_hub', 'sort_recent', locale)}</SelectItem>
                  <SelectItem value="popular">{t('publications_hub', 'sort_popular', locale)}</SelectItem>
                  <SelectItem value="az">{t('publications_hub', 'sort_az', locale)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map(cat => (
                <Badge
                  key={cat}
                  variant={categoryFilter === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter(cat)}
                >
                  {cat === 'all' ? t('publications_hub', 'filter_all', locale) : cat}
                </Badge>
              ))}
            </div>
          </div>
        </section>
        
        {/* Publications Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Results Counter */}
          <p className="text-muted-foreground mb-6">
            {t('publications_hub', 'results_showing', locale)} {sortedPublications.length} {t('publications_hub', 'results_publications', locale)}
          </p>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* Empty State */}
          {!isLoading && sortedPublications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl font-semibold mb-2">{t('publications_hub', 'no_results', locale)}</p>
              <p className="text-muted-foreground">{t('publications_hub', 'try_different', locale)}</p>
            </div>
          )}
          
          {/* Publications Grid */}
          {!isLoading && sortedPublications.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedPublications.map(pub => (
                <PublicationCard key={pub.id} publication={pub} locale={locale} />
              ))}
            </div>
          )}
        </section>
        
        {/* Subscribe CTA */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-hero text-3xl font-bold mb-4">
              {t('publications_hub', 'subscribe_title', locale)}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('publications_hub', 'subscribe_desc', locale)}
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('publications_hub', 'subscribe_email_placeholder', locale)}
                className="flex-1"
              />
              <Button type="submit" className="bg-gradient-cta text-white">
                {t('publications_hub', 'subscribe_button', locale)}
              </Button>
            </form>
          </div>
        </section>
        
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          aria-label={t('publications_hub', 'back_to_top', locale)}
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      </main>
      
      <Footer locale={locale} />
    </>
  );
}
