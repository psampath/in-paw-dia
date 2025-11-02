import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminBreedForm = () => {
  const { id } = useParams();
  const isEdit = id !== 'new';
  const navigate = useNavigate();
  const { user, userRole } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    origin: '',
    physical_appearance: '',
    temperament: '',
    lifespan: '',
    care_requirements: '',
    health_issues: '',
    suitability: '',
    weight_range: '',
    size: 'Medium',
    photos: [''],
    is_featured: false,
  });

  useEffect(() => {
    if (!user || (userRole !== 'editor' && userRole !== 'admin')) {
      navigate('/auth');
      return;
    }

    if (isEdit) {
      fetchBreed();
    }
  }, [user, userRole, isEdit, id, navigate]);

  const fetchBreed = async () => {
    const { data, error } = await supabase.from('pets').select('*').eq('id', id).single();

    if (!error && data) {
      setFormData({
        name: data.name || '',
        type: data.type || 'dog',
        origin: data.origin || '',
        physical_appearance: data.physical_appearance || '',
        temperament: data.temperament || '',
        lifespan: data.lifespan || '',
        care_requirements: data.care_requirements || '',
        health_issues: data.health_issues || '',
        suitability: data.suitability || '',
        weight_range: data.weight_range || '',
        size: data.size || 'Medium',
        photos: data.photos && data.photos.length > 0 ? data.photos : [''],
        is_featured: data.is_featured || false,
      });
    } else {
      toast.error('Pet not found');
      navigate('/admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Filter out empty photo URLs
    const photos = formData.photos.filter((url) => url.trim() !== '');

    const breedData = {
      ...formData,
      photos,
    };

    let error;

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('pets')
        .update(breedData)
        .eq('id', id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('pets').insert([breedData]);
      error = insertError;
    }

    if (error) {
      toast.error(error.message || 'Failed to save breed');
    } else {
      toast.success(`Breed ${isEdit ? 'updated' : 'created'} successfully!`);
      navigate('/admin');
    }

    setLoading(false);
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = value;
    setFormData({ ...formData, photos: newPhotos });
  };

  const addPhotoField = () => {
    setFormData({ ...formData, photos: [...formData.photos, ''] });
  };

  const removePhotoField = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos.length > 0 ? newPhotos : [''] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-3xl">
              {isEdit ? 'Edit Breed' : 'Add New Breed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small">Small</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Large">Large</SelectItem>
                      <SelectItem value="Giant">Giant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight_range">Weight Range</Label>
                  <Input
                    id="weight_range"
                    placeholder="e.g., 15-25 kg"
                    value={formData.weight_range}
                    onChange={(e) => setFormData({ ...formData, weight_range: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="lifespan">Lifespan</Label>
                  <Input
                    id="lifespan"
                    placeholder="e.g., 12-14 years"
                    value={formData.lifespan}
                    onChange={(e) => setFormData({ ...formData, lifespan: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="physical_appearance">Physical Appearance</Label>
                <Textarea
                  id="physical_appearance"
                  rows={4}
                  value={formData.physical_appearance}
                  onChange={(e) => setFormData({ ...formData, physical_appearance: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="temperament">Temperament</Label>
                <Textarea
                  id="temperament"
                  rows={4}
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="care_requirements">Care Requirements</Label>
                <Textarea
                  id="care_requirements"
                  rows={4}
                  value={formData.care_requirements}
                  onChange={(e) => setFormData({ ...formData, care_requirements: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="health_issues">Health Issues</Label>
                <Textarea
                  id="health_issues"
                  rows={4}
                  value={formData.health_issues}
                  onChange={(e) => setFormData({ ...formData, health_issues: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="suitability">Suitability</Label>
                <Textarea
                  id="suitability"
                  rows={4}
                  value={formData.suitability}
                  onChange={(e) => setFormData({ ...formData, suitability: e.target.value })}
                />
              </div>

              <div>
                <Label>Photo URLs</Label>
                <div className="space-y-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={photo}
                        onChange={(e) => handlePhotoChange(index, e.target.value)}
                      />
                      {formData.photos.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removePhotoField(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addPhotoField}>
                    Add Another Photo
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_featured" className="cursor-pointer">
                  Feature this breed on homepage
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : isEdit ? 'Update Breed' : 'Create Breed'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBreedForm;
