-- PetVerse: Multi-species pet encyclopedia with AI recommendation system

-- 1. Create species table (extensible for any animal type)
CREATE TABLE public.species (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.species ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Species are viewable by everyone"
ON public.species FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage species"
ON public.species FOR ALL
TO authenticated
USING (public.has_editor_access(auth.uid()))
WITH CHECK (public.has_editor_access(auth.uid()));

-- 2. Create traits table (reusable characteristics)
CREATE TYPE public.trait_type AS ENUM ('text', 'number', 'range', 'boolean', 'enum');

CREATE TABLE public.traits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  type trait_type NOT NULL,
  options JSONB, -- For enum types, stores array of options
  unit TEXT, -- For number/range (e.g., "kg", "years")
  min_value NUMERIC,
  max_value NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.traits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Traits are viewable by everyone"
ON public.traits FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage traits"
ON public.traits FOR ALL
TO authenticated
USING (public.has_editor_access(auth.uid()))
WITH CHECK (public.has_editor_access(auth.uid()));

-- 3. Rename and enhance breeds table to pets table
ALTER TABLE public.breeds RENAME TO pets;

-- Add new columns for PetVerse
ALTER TABLE public.pets 
  ADD COLUMN IF NOT EXISTS species_id UUID REFERENCES public.species(id),
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS traits JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0;

-- Create unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS pets_slug_idx ON public.pets(slug);

-- Update RLS policies for pets table
DROP POLICY IF EXISTS "Breeds are viewable by everyone" ON public.pets;
DROP POLICY IF EXISTS "Editors and admins can insert breeds" ON public.pets;
DROP POLICY IF EXISTS "Editors and admins can update breeds" ON public.pets;
DROP POLICY IF EXISTS "Admins can delete breeds" ON public.pets;

CREATE POLICY "Pets are viewable by everyone"
ON public.pets FOR SELECT USING (true);

CREATE POLICY "Editors and admins can insert pets"
ON public.pets FOR INSERT
TO authenticated
WITH CHECK (public.has_editor_access(auth.uid()));

CREATE POLICY "Editors and admins can update pets"
ON public.pets FOR UPDATE
TO authenticated
USING (public.has_editor_access(auth.uid()));

CREATE POLICY "Admins can delete pets"
ON public.pets FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Create questionnaire system
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('single', 'multi', 'slider', 'text')),
  options JSONB, -- For single/multi choice
  weight NUMERIC DEFAULT 1.0, -- Importance for scoring
  trait_mapping JSONB, -- Maps answers to trait scores
  order_num INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions are viewable by everyone"
ON public.questions FOR SELECT USING (true);

CREATE POLICY "Editors and admins can manage questions"
ON public.questions FOR ALL
TO authenticated
USING (public.has_editor_access(auth.uid()))
WITH CHECK (public.has_editor_access(auth.uid()));

-- 5. Create user responses table
CREATE TABLE public.user_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  answers JSONB NOT NULL,
  recommended_pet_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own responses"
ON public.user_responses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create responses"
ON public.user_responses FOR INSERT
WITH CHECK (true);

-- 6. Add trigger for updated_at on new tables
CREATE TRIGGER update_species_updated_at
BEFORE UPDATE ON public.species
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Seed initial species data
INSERT INTO public.species (name, slug, description) VALUES
  ('Dog', 'dog', 'Loyal companions with diverse breeds suited for various lifestyles'),
  ('Cat', 'cat', 'Independent yet affectionate felines perfect for indoor living'),
  ('Bird', 'bird', 'Colorful, intelligent creatures that bring song to your home'),
  ('Reptile', 'reptile', 'Unique cold-blooded pets requiring specialized care'),
  ('Small Mammal', 'small-mammal', 'Compact, playful companions like rabbits and hamsters'),
  ('Fish', 'fish', 'Serene aquatic pets that create peaceful environments');

-- 8. Seed common traits
INSERT INTO public.traits (key, label, type, unit, min_value, max_value) VALUES
  ('lifespan', 'Lifespan', 'range', 'years', 1, 100),
  ('weight', 'Weight', 'range', 'kg', 0.1, 200),
  ('size', 'Size', 'enum', NULL, NULL, NULL),
  ('temperament', 'Temperament', 'text', NULL, NULL, NULL),
  ('energy_level', 'Energy Level', 'enum', NULL, NULL, NULL),
  ('grooming_needs', 'Grooming Needs', 'enum', NULL, NULL, NULL),
  ('kid_friendly', 'Kid Friendly', 'boolean', NULL, NULL, NULL),
  ('apartment_suitable', 'Apartment Suitable', 'boolean', NULL, NULL, NULL),
  ('heat_tolerance', 'Heat Tolerance', 'enum', NULL, NULL, NULL);

UPDATE public.traits SET options = '["Small", "Medium", "Large", "Giant"]'::jsonb WHERE key = 'size';
UPDATE public.traits SET options = '["Low", "Medium", "High"]'::jsonb WHERE key = 'energy_level';
UPDATE public.traits SET options = '["Low", "Medium", "High"]'::jsonb WHERE key = 'grooming_needs';
UPDATE public.traits SET options = '["Low", "Medium", "High"]'::jsonb WHERE key = 'heat_tolerance';

-- 9. Migrate existing breed data to pets with species
UPDATE public.pets 
SET species_id = (SELECT id FROM public.species WHERE slug = public.pets.type LIMIT 1),
    slug = LOWER(REPLACE(name, ' ', '-')),
    traits = jsonb_build_object(
      'size', size,
      'temperament', temperament,
      'lifespan', lifespan,
      'weight', weight_range,
      'care_requirements', care_requirements,
      'health_issues', health_issues,
      'apartment_suitable', suitability ILIKE '%apartment%'
    )
WHERE species_id IS NULL;