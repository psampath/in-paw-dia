import { useEffect, useState } from 'react';
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
}

const Home = () => {
  const [featuredBreeds, setFeaturedBreeds] = useState<Breed[]>([]);
  const [carouselBreeds, setCarouselBreeds] = useState<Breed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Breed[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchFeaturedBreeds();
    fetchCarouselBreeds();
  }, []);

  const fetchFeaturedBreeds = async () => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('is_featured', true)
      .limit(6);

    if (!error && data) {
      setFeaturedBreeds(data);
    }
  };

  const fetchCarouselBreeds = async () => {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('popularity_score', { ascending: false })
      .limit(10);

    if (!error && data) {
      setCarouselBreeds(data);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .ilike('name', `%${searchQuery}%`)
        .order('name', { ascending: true });

      if (!error && data) {
        setSearchResults(data);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover India's Beloved
              <span className="text-primary"> Dog & Cat Breeds</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explore comprehensive information about breeds suited for Indian climates, 
              temperaments, care requirements, and find your perfect companion.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for breeds (e.g., Indian Pariah, Himalayan Cat)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 text-lg rounded-full"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Carousel - Hidden when searching */}
            {!isSearching && carouselBreeds.length > 0 && (
              <Carousel className="max-w-5xl mx-auto">
                <CarouselContent>
                  {carouselBreeds.map((breed) => (
                    <CarouselItem key={breed.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="p-2">
                        <BreedCard
                          id={breed.id}
                          name={breed.name}
                          type={breed.type as 'dog' | 'cat'}
                          temperament={breed.temperament}
                          size={breed.size}
                          photos={breed.photos}
                          origin={breed.origin}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            )}

            {/* Search Results */}
            {isSearching && (
              <div className="max-w-7xl mx-auto mt-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((breed) => (
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
                ) : (
                  <p className="text-muted-foreground text-center">No results found for "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Breeds Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Breeds
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Popular dog and cat breeds that thrive in India's diverse climates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-slide-up">
            {featuredBreeds.map((breed) => (
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

          <div className="text-center">
            <Link to="/breeds">
              <Button size="lg" className="rounded-full">
                View All Breeds
              </Button>
            </Link>
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
            <Link to="/breeds?type=dog&origin=India">
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

            <Link to="/breeds?type=cat">
              <div className="bg-card p-8 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all duration-300 text-center group">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  Popular Cats
                </h3>
                <p className="text-muted-foreground">
                  Feline companions suited for Indian homes
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
                  Perfect breeds for apartment living
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
