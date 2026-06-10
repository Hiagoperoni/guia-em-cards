import { IsNotEmpty, IsString } from 'class-validator';

export class GlossaryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  explanation: string;
}
