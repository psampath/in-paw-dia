-- Create breeds table
CREATE TABLE public.breeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat')),
  origin TEXT,
  physical_appearance TEXT,
  temperament TEXT,
  lifespan TEXT,
  care_requirements TEXT,
  health_issues TEXT,
  suitability TEXT,
  weight_range TEXT,
  size TEXT CHECK (size IN ('Small', 'Medium', 'Large', 'Giant')),
  photos TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'editor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for breeds (public read, admin write)
CREATE POLICY "Breeds are viewable by everyone"
ON public.breeds
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert breeds"
ON public.breeds
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('editor', 'admin')
  )
);

CREATE POLICY "Admins can update breeds"
ON public.breeds
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('editor', 'admin')
  )
);

CREATE POLICY "Admins can delete breeds"
ON public.breeds
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by owner"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates on breeds
CREATE TRIGGER update_breeds_updated_at
BEFORE UPDATE ON public.breeds
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_breeds_type ON public.breeds(type);
CREATE INDEX idx_breeds_size ON public.breeds(size);
CREATE INDEX idx_breeds_is_featured ON public.breeds(is_featured);
CREATE INDEX idx_breeds_name ON public.breeds(name);

-- Insert some sample Indian breed data
INSERT INTO public.breeds (name, type, origin, physical_appearance, temperament, lifespan, care_requirements, health_issues, suitability, weight_range, size, is_featured, photos) VALUES
('Indian Pariah Dog', 'dog', 'India', 'Medium-sized with a short coat, erect ears, and curled tail. Coat colors vary from brown, black, to cream.', 'Intelligent, alert, loyal, and highly adaptable. Known for their street-smart nature and strong survival instincts.', '13-14 years', 'Low maintenance. Minimal grooming required. Regular exercise and mental stimulation needed.', 'Generally healthy with few genetic issues. May be prone to tick-borne diseases in certain regions.', 'Excellent for Indian climate. Great family dogs, apartment-friendly with proper exercise. Heat-tolerant and adaptable.', '15-25 kg', 'Medium', true, ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb']),
('Rajapalayam', 'dog', 'Tamil Nadu, India', 'Large, muscular dog with a distinctive white coat, pink nose, and golden eyes. Athletic build with a slight curve in the tail.', 'Loyal, protective, and territorial. Excellent guard dogs with strong hunting instincts. Reserved with strangers.', '10-12 years', 'Moderate to high maintenance. Regular exercise essential. Weekly grooming. Needs experienced handler.', 'Generally robust but can be prone to deafness and skin issues in some lines.', 'Best suited for houses with space. Not ideal for first-time owners. Excellent guard dog for rural settings.', '30-35 kg', 'Large', true, ARRAY['https://images.unsplash.com/photo-1568572933382-74d440642117']),
('Gaddi Kutta', 'dog', 'Himachal Pradesh, India', 'Large, heavy-boned mountain dog with thick double coat. Comes in various colors including black, brown, and brindle.', 'Brave, loyal, and protective. Excellent guard dogs with strong territorial instincts. Gentle with family.', '10-12 years', 'High maintenance. Regular grooming needed. Requires ample space and exercise. Suited for cold climates.', 'Hip dysplasia can occur. Generally healthy with proper care and nutrition.', 'Best for mountain or cold regions. Not suited for apartments. Needs experienced owner.', '30-40 kg', 'Large', false, ARRAY['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e']),
('Indian Spitz', 'dog', 'India', 'Small to medium-sized with fluffy double coat, pointed muzzle, and plumed tail. Typically white or cream colored.', 'Friendly, energetic, and intelligent. Great companion dogs. Alert and vocal, making good watchdogs.', '10-14 years', 'Moderate maintenance. Regular grooming needed. Daily exercise required. Easy to train.', 'Generally healthy. May be prone to dental issues and obesity if overfed.', 'Excellent for apartments and small spaces. Good with children. Adapts well to Indian climate.', '5-7 kg', 'Small', true, ARRAY['https://images.unsplash.com/photo-1611003228941-98852ba62227']),
('Himalayan Cat', 'cat', 'Developed in India/Himalayan region', 'Long-haired cat with Persian body type and Siamese color points. Round face with a flat nose and large expressive eyes.', 'Gentle, calm, and affectionate. Less active than typical cats. Enjoys companionship and quiet environments.', '9-15 years', 'High maintenance. Daily grooming essential. Regular eye cleaning needed. Indoor living preferred.', 'Prone to respiratory issues, kidney disease, and dental problems. Regular vet checkups important.', 'Good for apartments. Requires air-conditioned environment in hot climates. Best for patient owners.', '4-6 kg', 'Medium', true, ARRAY['https://images.unsplash.com/photo-1615789591457-74a63395c990']),
('Indian Billi (Domestic Short Hair)', 'cat', 'India', 'Medium-sized with short coat in various colors and patterns. Muscular build with alert expression.', 'Adaptable, independent, and affectionate. Good hunters. Low-maintenance temperament.', '12-18 years', 'Low maintenance. Minimal grooming needed. Adaptable to various living conditions.', 'Generally very healthy and hardy. May need regular deworming and vaccinations.', 'Highly adaptable to Indian climate. Good for apartments and houses. Heat-tolerant.', '3-5 kg', 'Medium', true, ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006']);
