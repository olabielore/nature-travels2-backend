import { Schema, model } from 'mongoose';
import { COLLECTIONS } from '../constants/collections.js';

const storySchema = new Schema(
  {
    img: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: COLLECTIONS.CATEGORY,
    },
    rate: { type: Number, default: 0 },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: COLLECTIONS.USER,
      required: true,
    },
    date: { type: Date, required: true },
    article: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

storySchema.index({
  title: 'text',
  article: 'text',
});

export const Story = model(COLLECTIONS.STORY, storySchema);
