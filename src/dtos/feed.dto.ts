import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Data transfer object for creating a new feed.
 */
export class CreateFeedDto {
  /**
   * The heading of the feed.
   */
  @IsString()
  @IsNotEmpty()
  public heading: string;

  /**
   * The subheading of the feed (optional).
   */
  @IsString()
  @IsOptional()
  public subHeading: string;

  /**
   * The author of the feed (optional).
   */
  @IsString()
  @IsOptional()
  public author: string;

  /**
   * The link of the feed (optional).
   */
  @IsString()
  @IsOptional()
  public link: string;

  /**
   * The image of the feed (optional).
   */
  @IsString()
  @IsOptional()
  public image: string;

  /**
   * The provider of the feed.
   */
  @IsString()
  @IsNotEmpty()
  public provider: string;
}

export class GetFeedsDto {
  @IsNumber()
  @IsOptional()
  public skip: number;
  @IsNumber()
  @IsOptional()
  public limit: number;
}
