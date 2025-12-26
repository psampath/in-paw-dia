import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Pet } from '../models/Pet';
import { ApiError } from '../middleware/errorHandler';

export const getAllPets = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pets = await Pet.find().sort({ name: 1 });

    res.json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id).populate('species_id');

    if (!pet) {
      throw new ApiError('Pet not found', 404);
    }

    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const createPet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(errors.array()[0].msg, 400);
    }

    const pet = await Pet.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pet created successfully',
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(errors.array()[0].msg, 400);
    }

    const pet = await Pet.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!pet) {
      throw new ApiError('Pet not found', 404);
    }

    res.json({
      success: true,
      message: 'Pet updated successfully',
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const pet = await Pet.findByIdAndDelete(id);

    if (!pet) {
      throw new ApiError('Pet not found', 404);
    }

    res.json({
      success: true,
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
