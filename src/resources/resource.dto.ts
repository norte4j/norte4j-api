import {Type} from 'class-transformer';
import {ArrayMaxSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUrl, Min, ValidateNested} from 'class-validator';

class SocialLinkDto {
  @IsUrl({allow_protocol_relative_urls: true}) url: string;
  @IsIn(['link', 'linkedin', 'facebook', 'github', 'instagram']) icone: string;
}

export class ResourceDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsInt() @Min(0) idade?: number;
  @IsOptional() @IsString() papel?: string;
  @IsOptional() @IsString() foto?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(4) @ValidateNested({each: true}) @Type(() => SocialLinkDto)
  redes_sociais?: SocialLinkDto[];
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
