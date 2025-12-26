import mongoose, { Document, Schema } from 'mongoose';

export type TraitType = 'text' | 'number' | 'range' | 'boolean' | 'enum';

export interface ITrait extends Document {
  key: string;
  label: string;
  type: TraitType;
  min_value?: number;
  max_value?: number;
  unit?: string;
  options?: Record<string, any>;
  createdAt: Date;
}

const traitSchema = new Schema<ITrait>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['text', 'number', 'range', 'boolean', 'enum'],
    },
    min_value: {
      type: Number,
    },
    max_value: {
      type: Number,
    },
    unit: {
      type: String,
    },
    options: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Trait = mongoose.model<ITrait>('Trait', traitSchema);
