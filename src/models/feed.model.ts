import { model, Schema, Document, Model } from 'mongoose';
import { Feed } from '@/interfaces/feed.interface';

let FeedModel: Model<Feed & Document<any, any, any>, {}, {}, {}, any>;

try {
  FeedModel = model<Feed & Document>('Feed');
} catch {
  /**
   * Defines the schema for a feed item.
   */
  const FeedSchema: Schema = new Schema(
    {
      /**
       * The main heading of the feed item.
       */
      heading: {
        type: String,
        required: true,
      },
      /**
       * The subheading of the feed item.
       */
      subHeading: {
        type: String,
        required: false,
      },
      /**
       * The author of the feed item.
       */
      author: {
        type: String,
        required: false,
      },
      /**
       * The link to the feed item.
       */
      link: {
        type: String,
        required: false,
      },
      /**
       * The image associated with the feed item.
       */
      image: {
        type: String,
        required: false,
      },
      /**
       * The provider of the feed item.
       */
      provider: {
        type: String,
        required: true,
      },
    },
    { timestamps: true, strict: false },
  );
  FeedModel = model<Feed & Document>('Feed', FeedSchema);
}

class FeedModelWrapper {
  /**
   * Creates a new feed document in the database.
   * @param feed - The feed object to be created.
   * @returns A Promise that resolves to the created feed document.
   */
  public async create(feed: Feed): Promise<Feed & Document> {
    const createdFeed = new FeedModel(feed);
    return createdFeed.save();
  }

  /**
   * Finds all feed documents in the database.
   * @param skip - The number of documents to skip.
   * @param limit - The maximum number of documents to return.
   * @returns A Promise that resolves to an array of feed documents.
   */
  public async findAll(skip: number, limit: number): Promise<(Feed & Document)[]> {
    return FeedModel.find().skip(skip).limit(limit).exec();
  }

  /**
   * Finds a feed document in the database by its ID.
   * @param id - The ID of the feed document to find.
   * @returns A Promise that resolves to the found feed document.
   */
  public async findById(id: string): Promise<Feed & Document> {
    return FeedModel.findById(id).exec();
  }

  /**
   * Updates a feed document in the database by its ID.
   * @param id - The ID of the feed document to update.
   * @param feed - The updated feed object.
   * @returns A Promise that resolves to the updated feed document.
   */
  public async updateById(id: string, feed: Feed): Promise<Feed & Document> {
    return FeedModel.findByIdAndUpdate(id, feed, { new: true }).exec();
  }

  /**
   * Deletes a feed document from the database by its ID.
   * @param id - The ID of the feed document to delete.
   * @returns A Promise that resolves to the deleted feed document.
   */
  public async deleteById(id: string): Promise<Feed & Document> {
    return FeedModel.findByIdAndDelete(id).exec();
  }

  /**
   * Inserts multiple feed documents into the database.
   * @param feeds - An array of feed objects to be inserted.
   * @returns A Promise that resolves to an array of the inserted feed documents.
   */
  public async insertMany(feeds: Feed[]): Promise<(Feed & Document)[]> {
    return FeedModel.insertMany(feeds);
  }
}

export default FeedModelWrapper;
