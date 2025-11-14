import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTable } from '@/components/admin/PageTable';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Pages Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/admin/new')}>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Button>
            <Button 
              onClick={async () => { 
                try {
                  await supabase.functions.invoke('generate-sitemap', { 
                    body: { forceRefresh: true } 
                  }); 
                  toast({ 
                    title: "Success", 
                    description: "Sitemap refreshed successfully!" 
                  }); 
                } catch (error) {
                  toast({ 
                    title: "Error", 
                    description: "Failed to refresh sitemap",
                    variant: "destructive"
                  }); 
                }
              }} 
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Sitemap
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <PageTable />
      </div>
    </div>
  );
}
