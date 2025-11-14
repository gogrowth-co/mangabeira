import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function RssFeed() {
  const { lang } = useParams<{ lang: string }>();
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    const fetchRss = async () => {
      try {
        // Call edge function with language as query parameter
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-rss?lang=${lang || 'en'}`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch RSS');
        
        const xmlText = await response.text();
        setXml(xmlText);
      } catch (error) {
        console.error('Error fetching RSS feed:', error);
        setXml('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Error</title></channel></rss>');
      }
    };

    fetchRss();
  }, [lang]);

  // Return raw XML without any React wrapper
  if (!xml) return null;

  return (
    <div dangerouslySetInnerHTML={{ __html: xml }} style={{ display: 'none' }} />
  );
}
