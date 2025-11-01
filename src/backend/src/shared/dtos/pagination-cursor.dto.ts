import { IsEnum, IsOptional, IsString } from "class-validator";
import { ESortOrder } from "../enums";
import { ApiProperty } from "@nestjs/swagger";
import { StringToNumberTransform } from "../transforms";

export class PaginationCursorQueryDto {
  @ApiProperty({ 
    type: String, 
    description: 'The cursor for pagination',
    required: false 
  })
  @IsOptional()
  @IsString()
  cursor?: string;
  
  @ApiProperty({ 
    type: Number, 
    description: 'The number of items to retrieve',
    default: 10 ,
    required: false
  })
  @IsOptional()
  @StringToNumberTransform()
  limit?: number;
  
  @ApiProperty({ 
    type: String, 
    enum: ESortOrder,
    enumName: 'ESortOrder',
    description: 'The sort order for pagination',
    required: false 
  })
  @IsOptional()
  @IsEnum(ESortOrder)
  sortOrder?: ESortOrder;
}

export interface PaginationCursorQuery {
  cursor: string | null;
  limit: number;
  sortOrder: ESortOrder;
}

export class PaginationCursorResponseDto<T> {
  items: T[];
  nextCursor: string | null;
}