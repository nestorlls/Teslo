import { IsString, MinLength } from 'class-validator';

export class MessageDto {
  @IsString()
  @MinLength(1)
  id: string;

  @IsString()
  @MinLength(1)
  message: string;
}
