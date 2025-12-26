import apiClient from './client';
import { Pet, PetsResponse, PetResponse, MessageResponse } from './types';

export const getAllPets = async (): Promise<Pet[]> => {
  const response = await apiClient.get<PetsResponse>('/pets');
  return response.data.data;
};

export const getPetById = async (id: string): Promise<Pet> => {
  const response = await apiClient.get<PetResponse>(`/pets/${id}`);
  return response.data.data;
};

export const createPet = async (petData: Partial<Pet>): Promise<Pet> => {
  const response = await apiClient.post<PetResponse>('/pets', petData);
  return response.data.data;
};

export const updatePet = async (
  id: string,
  petData: Partial<Pet>
): Promise<Pet> => {
  const response = await apiClient.put<PetResponse>(`/pets/${id}`, petData);
  return response.data.data;
};

export const deletePet = async (id: string): Promise<MessageResponse> => {
  const response = await apiClient.delete<MessageResponse>(`/pets/${id}`);
  return response.data;
};
