import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Sitemap() {
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) throw error;
        
        // The response from edge function is already XML text
        const xmlText = typeof data === 'string' ? data : await data.text();
        setXml(xmlText);
      } catch (error) {
        console.error('Error fetching sitemap:', error);
        setXml('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
      }
    };

    fetchSitemap();
  }, []);

  // Return raw XML without any React wrapper
  if (!xml) return null;

  return (
    <div dangerouslySetInnerHTML={{ __html: xml }} style={{ display: 'none' }} />
  );
}
