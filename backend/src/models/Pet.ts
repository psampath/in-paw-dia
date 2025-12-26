import mongoose, { Document, Schema } from 'mongoose';

export interface IPet extends Document {
  name: string;
  type: 'dog' | 'cat';
  slug?: string;
  origin?: string;
  physical_appearance?: string;
  temperament?: string;
  lifespan?: string;
  care_requirements?: string;
  health_issues?: string;
  suitability?: string;
  weight_range?: string;
  size?: string;
  photos?: string[];
  traits?: Record<string, any>;
  species_id?: mongoose.Types.ObjectId;
  is_featured?: boolean;
  popularity_score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const petSchema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['dog', 'cat'],
    },
    slug: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    physical_appearance: {
      type: String,
    },
    temperament: {
      type: String,
    },
    lifespan: {
      type: String,
    },
    care_requirements: {
      type: String,
    },
    health_issues: {
      type: String,
    },
    suitability: {
      type: String,
    },
    weight_range: {
      type: String,
    },
    size: {
      type: String,
    },
    photos: {
      type: [String],
      default: [],
    },
    traits: {
      type: Schema.Types.Mixed,
      default: {},
    },
    species_id: {
      type: Schema.Types.ObjectId,
      ref: 'Species',
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    popularity_score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on name for faster searches
petSchema.index({ name: 1 });
petSchema.index({ type: 1 });
petSchema.index({ popularity_score: -1 });

export const Pet = mongoose.model<IPet>('Pet', petSchema);
