import mongoose, { Document, Schema } from 'mongoose';

export interface ISpecies extends Document {
  name: string;
  slug: string;
  description?: string;
  icon_url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const speciesSchema = new Schema<ISpecies>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    icon_url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Species = mongoose.model<ISpecies>('Species', speciesSchema);
