import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTable } from '@/components/admin/PageTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { isDevMode } from '@/lib/adminCheck';

export default function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDevMode()) {
      navigate('/');
    }
  }, [navigate]);

  if (!isDevMode()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pages Admin</h1>
          <Button onClick={() => navigate('/admin/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Page
          </Button>
        </div>
        
        <PageTable />
      </div>
    </div>
  );
}
