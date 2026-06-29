import { model, Schema } from 'mongoose';
import { COLLECTIONS } from '../constants/collections.js';

const categorySchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.CATEGORY,
      required: true,
    },
    category: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false },
);

export const Category = model(COLLECTIONS.CATEGORY, categorySchema);
