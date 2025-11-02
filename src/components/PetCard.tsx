import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface PetCardProps {
  id: string;
  name: string;
  slug: string;
  species: { name: string; slug: string };
  photos: string[];
  traits: any;
  is_featured?: boolean;
}

export const PetCard = ({ id, name, slug, species, photos, traits, is_featured }: PetCardProps) => {
  const primaryPhoto = photos?.[0] || '/placeholder.svg';
  const size = traits?.size || 'Medium';
  const temperament = traits?.temperament || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/pets/${slug}`}>
        <div className="glass-card hover-lift group cursor-pointer overflow-hidden h-full">
          {/* Image with gradient overlay */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={primaryPhoto}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {is_featured && (
              <div className="absolute top-3 right-3">
                <Badge className="neon-glow-primary bg-primary/90 backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
            
            {/* Species badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="backdrop-blur-sm bg-secondary/80">
                {species?.name}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/30">
                {size}
              </Badge>
              {temperament && (
                <Badge variant="outline" className="border-secondary/30">
                  {temperament.split(',')[0]?.trim()}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {traits?.care_requirements?.substring(0, 100) || 'Click to learn more about this amazing companion'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
