import { Link } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userRole, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary hover:text-primary/90 transition-colors">
            <PawPrint className="h-6 w-6" />
            IndianTails
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <Link to="/breeds" className="text-foreground hover:text-primary transition-colors font-medium">
              Breeds
            </Link>
            {user && (userRole === 'editor' || userRole === 'admin') && (
              <Link to="/admin" className="text-foreground hover:text-primary transition-colors font-medium">
                Admin
              </Link>
            )}
            {user ? (
              <Button onClick={signOut} variant="outline" size="sm">
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            <Link
              to="/"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/breeds"
              className="block text-foreground hover:text-primary transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Breeds
            </Link>
            {user && (userRole === 'editor' || userRole === 'admin') && (
              <Link
                to="/admin"
                className="block text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {user ? (
              <Button onClick={() => { signOut(); setIsMenuOpen(false); }} variant="outline" size="sm" className="w-full">
                Logout
              </Button>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" size="sm" className="w-full">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
