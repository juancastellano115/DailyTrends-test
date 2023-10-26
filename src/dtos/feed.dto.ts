import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public example: string;
}

export class UpdateFeedDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public example: string;
}
