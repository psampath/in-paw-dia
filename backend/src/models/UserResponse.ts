import mongoose, { Document, Schema } from 'mongoose';

export interface IUserResponse extends Document {
  user_id?: mongoose.Types.ObjectId;
  session_id?: string;
  answers: Record<string, any>;
  recommended_pet_ids?: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const userResponseSchema = new Schema<IUserResponse>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    session_id: {
      type: String,
    },
    answers: {
      type: Schema.Types.Mixed,
      required: true,
    },
    recommended_pet_ids: {
      type: [Schema.Types.ObjectId],
      ref: 'Pet',
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const UserResponse = mongoose.model<IUserResponse>('UserResponse', userResponseSchema);
