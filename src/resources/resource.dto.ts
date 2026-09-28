import {IsArray, IsBoolean, IsInt, IsIn, IsOptional, IsString, IsUrl} from 'class-validator';

export class ResourceDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() date?: string;
  @IsOptional() @IsString() time?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() longDescription?: string;
  @IsOptional() @IsString() value?: string;
  @IsOptional() @IsString() key?: string;
  @IsOptional() @IsString() label?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() subject?: string;
  @IsOptional() @IsString() message?: string;
  @IsOptional() @IsString() alt?: string;
  @IsOptional() @IsString() src?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() storagePath?: string;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() type?: string;
  @IsOptional() @IsArray() @IsString({each: true}) topics?: string[];
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
}
