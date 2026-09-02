import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function RssFeed() {
  const { lang } = useParams<{ lang: string }>();
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    const fetchRss = async () => {
      try {
        // Static feed emitted at build time (dist/rss/<lang>.xml); in
        // production the host serves the file directly and this component
        // never mounts — this fetch is the SPA-navigation fallback.
        const response = await fetch(`/rss/${lang || 'en'}.xml`);
        
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
