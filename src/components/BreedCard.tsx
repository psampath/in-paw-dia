import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dog, Cat } from 'lucide-react';

interface BreedCardProps {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  temperament: string;
  size: string;
  photos: string[];
  origin?: string;
}

export const BreedCard = ({ id, name, type, temperament, size, photos, origin }: BreedCardProps) => {
  const displayImage = photos && photos.length > 0 ? photos[0] : 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1';

  return (
    <Link to={`/breeds/${id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            {type === 'dog' ? (
              <Dog className="h-5 w-5 text-primary" />
            ) : (
              <Cat className="h-5 w-5 text-primary" />
            )}
          </div>
          {origin && (
            <p className="text-sm text-muted-foreground mb-2">{origin}</p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {temperament}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Badge variant="secondary" className="text-xs">
            {size}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};
