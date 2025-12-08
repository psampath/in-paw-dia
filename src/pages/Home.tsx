import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { BreedCard } from '@/components/BreedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Heart, Shield, Home as HomeIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface Breed {
  id: string;
  name: string;
  type: string;
  temperament: string;
  size: string;
  photos: string[];
  origin: string;
  physical_appearance: string | null;
  care_requirements: string | null;
}

const Home = () => {
  const [allBreeds, setAllBreeds] = useState<Breed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllBreeds();
  }, []);

  const fetchAllBreeds = async () => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('popularity_score', { ascending: false });

    if (!error && data) {
      setAllBreeds(data);
    }
  };

  const filteredBreeds = useMemo(() => {
    if (!searchQuery.trim()) {
      return allBreeds;
    }
    const query = searchQuery.toLowerCase();
    return allBreeds.filter(breed => 
      breed.name?.toLowerCase().includes(query) ||
      breed.size?.toLowerCase().includes(query) ||
      breed.temperament?.toLowerCase().includes(query) ||
      breed.origin?.toLowerCase().includes(query) ||
      breed.physical_appearance?.toLowerCase().includes(query) ||
      breed.care_requirements?.toLowerCase().includes(query)
    );
  }, [searchQuery, allBreeds]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover India's Beloved
              <span className="text-primary"> Dog Breeds</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore comprehensive information about dog breeds suited for Indian climates, 
              temperaments, care requirements, and find your perfect companion.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, size, or traits (e.g., loyal, adaptable)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full"
                />
              </div>
            </div>

            {/* Carousel - shown when not searching */}
            {!isSearching && filteredBreeds.length > 0 && (
              <div className="max-w-5xl mx-auto">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {filteredBreeds.map((breed) => (
                      <CarouselItem key={breed.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                        <Link to={`/breeds/${breed.id}`} className="block group">
                          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                            <img
                              src={breed.photos?.[0] || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1'}
                              alt={breed.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="text-white font-heading font-bold text-sm md:text-base truncate">
                                {breed.name}
                              </h3>
                            </div>
                          </div>
                        </Link>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 md:-left-6" />
                  <CarouselNext className="-right-4 md:-right-6" />
                </Carousel>
                
                <div className="text-center mt-6">
                  <Link to="/breeds">
                    <Button size="lg" className="rounded-full">
                      View All Breeds
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Search Results - shown when searching */}
            {isSearching && filteredBreeds.length > 0 && (
              <div className="max-w-6xl mx-auto text-left">
                <p className="text-muted-foreground mb-6 text-center">
                  Found {filteredBreeds.length} breed{filteredBreeds.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBreeds.map((breed) => (
                    <BreedCard
                      key={breed.id}
                      id={breed.id}
                      name={breed.name}
                      type={breed.type as 'dog' | 'cat'}
                      temperament={breed.temperament}
                      size={breed.size}
                      photos={breed.photos}
                      origin={breed.origin}
                    />
                  ))}
                </div>
              </div>
            )}

            {isSearching && filteredBreeds.length === 0 && (
              <p className="text-muted-foreground">No breeds found matching "{searchQuery}"</p>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Link to="/breeds?origin=India">
              <div className="bg-card p-8 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-center group">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Indigenous Dogs
                </h3>
                <p className="text-muted-foreground">
                  Native Indian breeds perfectly adapted to local conditions
                </p>
              </div>
            </Link>

            <Link to="/breeds?size=Large">
              <div className="bg-card p-8 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-center group">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Large Breeds
                </h3>
                <p className="text-muted-foreground">
                  Loyal companions for spacious homes
                </p>
              </div>
            </Link>

            <Link to="/breeds?size=Small">
              <div className="bg-card p-8 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-center group">
                <HomeIcon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Apartment-Friendly
                </h3>
                <p className="text-muted-foreground">
                  Perfect small breeds for apartment living
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 IndianTails. All rights reserved.</p>
          <p className="mt-2">Helping you find the perfect companion for Indian homes.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;