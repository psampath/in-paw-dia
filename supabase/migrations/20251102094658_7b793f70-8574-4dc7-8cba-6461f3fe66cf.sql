-- Fix critical security issue: Separate user roles from profiles table
-- Step 1: Create app_role enum
CREATE TYPE public.app_role AS ENUM ('viewer', 'editor', 'admin');

-- Step 2: Create user_roles table (separate from profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Step 5: Create function to check if user has editor OR admin role
CREATE OR REPLACE FUNCTION public.has_editor_access(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('editor', 'admin')
  )
$$;

-- Step 6: Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role FROM public.profiles
WHERE role IN ('viewer', 'editor', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 7: Drop old RLS policies on breeds that depend on profiles.role
DROP POLICY IF EXISTS "Admins can delete breeds" ON public.breeds;
DROP POLICY IF EXISTS "Admins can insert breeds" ON public.breeds;
DROP POLICY IF EXISTS "Admins can update breeds" ON public.breeds;

-- Step 8: Create new RLS policies on breeds using new role system
CREATE POLICY "Admins can delete breeds"
ON public.breeds
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Editors and admins can insert breeds"
ON public.breeds
FOR INSERT
TO authenticated
WITH CHECK (public.has_editor_access(auth.uid()));

CREATE POLICY "Editors and admins can update breeds"
ON public.breeds
FOR UPDATE
TO authenticated
USING (public.has_editor_access(auth.uid()));

-- Step 9: Now safe to remove role column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Step 10: RLS policies on user_roles - users can only view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Step 11: Only admins can manage roles (prevent privilege escalation)
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Step 12: Update handle_new_user function with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Assign default viewer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;