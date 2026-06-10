import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResultType } from '@prisma/client';

export class CardResultDto {
  @IsString()
  cardId: string;

  @IsEnum(ResultType)
  result: ResultType;

  @IsInt()
  @IsOptional()
  timeSpentMs?: number;
}

export class FinishSessionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardResultDto)
  results: CardResultDto[];
}
