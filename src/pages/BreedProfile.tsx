import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Dog, Cat, Share2 } from 'lucide-react';
import { getPetById, Pet } from '@/lib/pets';
import { toast } from 'sonner';

const BreedProfile = () => {
  const { id } = useParams();
  const [breed, setBreed] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    if (id) fetchBreed();
  }, [id]);

  const fetchBreed = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getPetById(id);
      setBreed(data);
    } catch (error) {
      console.error('Failed to fetch breed:', error);
      toast.error('Breed not found');
    }
    setLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${breed?.name} - IndianTails`,
        text: `Learn about ${breed?.name} on IndianTails`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
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

  if (!breed) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Breed not found</p>
          <Link to="/breeds"><Button>Back to Breeds</Button></Link>
        </div>
      </div>
    );
  }

  const displayImage = breed.photos && breed.photos.length > 0 ? breed.photos[currentPhotoIndex] : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Link to="/breeds">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Breeds
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img src={displayImage} alt={breed.name} className="w-full h-full object-cover" />
            </div>
            {breed.photos && breed.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {breed.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${currentPhotoIndex === index ? 'border-primary' : 'border-transparent'}`}
                  >
                    <img src={photo} alt={`${breed.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">{breed.name}</h1>
                <p className="text-muted-foreground text-lg">{breed.origin}</p>
              </div>
              <div className="flex gap-2">
                {breed.type === 'dog' ? <Dog className="h-8 w-8 text-primary" /> : <Cat className="h-8 w-8 text-primary" />}
                <Button variant="outline" size="icon" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{breed.size}</Badge>
              <Badge variant="outline">{breed.type === 'dog' ? 'Dog' : 'Cat'}</Badge>
              <Badge variant="outline">{breed.weight_range}</Badge>
              <Badge variant="outline">{breed.lifespan}</Badge>
            </div>

            <Card>
              <CardHeader><CardTitle>Quick Facts</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Type</p><p className="font-medium capitalize">{breed.type}</p></div>
                  <div><p className="text-muted-foreground">Size</p><p className="font-medium">{breed.size}</p></div>
                  <div><p className="text-muted-foreground">Weight</p><p className="font-medium">{breed.weight_range}</p></div>
                  <div><p className="text-muted-foreground">Lifespan</p><p className="font-medium">{breed.lifespan}</p></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="temperament">Temperament</TabsTrigger>
            <TabsTrigger value="care">Care</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="suitability">Suitability</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card><CardHeader><CardTitle>Overview</CardTitle></CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>{breed.temperament}</p>
                <p className="mt-4 text-muted-foreground">
                  The {breed.name} is a {breed.size?.toLowerCase()}-sized {breed.type} with an average lifespan of {breed.lifespan}.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="temperament"><Card><CardHeader><CardTitle>Temperament & Personality</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line">{breed.temperament}</p></CardContent></Card></TabsContent>
          <TabsContent value="care"><Card><CardHeader><CardTitle>Care Requirements</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line">{breed.care_requirements}</p></CardContent></Card></TabsContent>
          <TabsContent value="health"><Card><CardHeader><CardTitle>Health Issues</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line">{breed.health_issues}</p></CardContent></Card></TabsContent>
          <TabsContent value="suitability"><Card><CardHeader><CardTitle>Suitability</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line">{breed.suitability}</p></CardContent></Card></TabsContent>
          <TabsContent value="appearance"><Card><CardHeader><CardTitle>Physical Appearance</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line">{breed.physical_appearance}</p></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BreedProfile;
