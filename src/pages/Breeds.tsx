import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { BreedCard } from '@/components/BreedCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { getAllPets } from '@/api/pets';
import { Pet } from '@/api/types';
import { Label } from '@/components/ui/label';

const Breeds = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [breeds, setBreeds] = useState<Pet[]>([]);
  const [filteredBreeds, setFilteredBreeds] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
  const [sizeFilter, setSizeFilter] = useState(searchParams.get('size') || 'all');
  const [originFilter, setOriginFilter] = useState(searchParams.get('origin') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    filterBreeds();
  }, [breeds, searchQuery, typeFilter, sizeFilter, originFilter]);

  const fetchBreeds = async () => {
    setLoading(true);
    try {
      const data = await getAllPets();
      // Sort by name
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setBreeds(sorted);
    } catch (error) {
      console.error('Failed to fetch breeds:', error);
    }
    setLoading(false);
  };

  const filterBreeds = () => {
    let filtered = [...breeds];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (breed) =>
          breed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          breed.temperament?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((breed) => breed.type === typeFilter);
    }

    // Size filter
    if (sizeFilter !== 'all') {
      filtered = filtered.filter((breed) => breed.size === sizeFilter);
    }

    // Origin filter
    if (originFilter !== 'all') {
      if (originFilter === 'India') {
        filtered = filtered.filter((breed) => breed.origin?.includes('India'));
      }
    }

    setFilteredBreeds(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setSizeFilter('all');
    setOriginFilter('all');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || sizeFilter !== 'all' || originFilter !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Browse All Breeds
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore {filteredBreeds.length} breeds suited for Indian conditions
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl border border-border p-4 md:p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search breeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Toggle Filters Button (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="dog">Dogs</SelectItem>
                  <SelectItem value="cat">Cats</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Size</Label>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Giant">Giant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Origin</Label>
              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Origins" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Origins</SelectItem>
                  <SelectItem value="India">Indigenous (India)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading breeds...</p>
          </div>
        ) : filteredBreeds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No breeds found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBreeds.map((breed) => (
              <BreedCard
                key={breed._id}
                id={breed._id}
                name={breed.name}
                type={breed.type}
                temperament={breed.temperament || ''}
                size={breed.size || ''}
                photos={breed.photos || []}
                origin={breed.origin || ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Breeds;
