import { model, Schema, Document } from 'mongoose';
import { Feed } from '@/interfaces/feed.interface';

const FeedSchema: Schema = new Schema({
  example: {
    type: String,
    required: true,
  },
});

export const FeedModel = model<Feed & Document>('Feed', FeedSchema);
