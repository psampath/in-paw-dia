import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getAllPets, deletePet, Pet } from '@/lib/pets';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Admin = () => {
  const [breeds, setBreeds] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (userRole !== 'editor' && userRole !== 'admin')) {
      navigate('/auth');
      return;
    }
    fetchBreeds();
  }, [user, userRole, navigate]);

  const fetchBreeds = async () => {
    setLoading(true);
    try {
      const data = await getAllPets();
      const sorted = [...data].sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      setBreeds(sorted);
    } catch (error) {
      console.error('Failed to fetch breeds:', error);
      toast.error('Failed to fetch breeds');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await deletePet(id);
      toast.success('Breed deleted successfully');
      fetchBreeds();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete breed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage breed information</p>
          </div>
          <Button onClick={() => navigate('/admin/breed/new')}>
            <Plus className="h-4 w-4 mr-2" />Add Breed
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card><CardHeader><CardTitle className="text-sm font-medium">Total Breeds</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-primary">{breeds.length}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Dog Breeds</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-primary">{breeds.filter((b) => b.type === 'dog').length}</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Cat Breeds</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-primary">{breeds.filter((b) => b.type === 'cat').length}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>All Breeds</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {breeds.map((breed) => (
                    <TableRow key={breed.id}>
                      <TableCell className="font-medium">{breed.name}</TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{breed.type}</Badge></TableCell>
                      <TableCell>{breed.origin || '-'}</TableCell>
                      <TableCell>{breed.size || '-'}</TableCell>
                      <TableCell>{new Date(breed.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/breed/${breed.id}`)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {userRole === 'admin' && (
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(breed.id, breed.name)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
