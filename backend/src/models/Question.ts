import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  type: string;
  options?: Record<string, any>;
  trait_mapping?: Record<string, any>;
  order_num?: number;
  weight?: number;
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    options: {
      type: Schema.Types.Mixed,
    },
    trait_mapping: {
      type: Schema.Types.Mixed,
    },
    order_num: {
      type: Number,
    },
    weight: {
      type: Number,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Question = mongoose.model<IQuestion>('Question', questionSchema);
