import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Pet = Tables<'pets'>;
export type PetInsert = TablesInsert<'pets'>;
export type PetUpdate = TablesUpdate<'pets'>;

export const getAllPets = async (): Promise<Pet[]> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const getPetById = async (id: string): Promise<Pet | null> => {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const createPet = async (petData: PetInsert): Promise<Pet> => {
  const { data, error } = await supabase
    .from('pets')
    .insert(petData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePet = async (id: string, petData: PetUpdate): Promise<Pet> => {
  const { data, error } = await supabase
    .from('pets')
    .update(petData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePet = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
