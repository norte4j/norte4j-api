import {IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Max, Min} from 'class-validator';

const CLICK_TAGS = [
  'nav_logo', 'nav_hero', 'nav_eventos', 'nav_galeria', 'nav_parcerias', 'nav_equipe', 'nav_sobre',
  'nav_mobile_hero', 'nav_mobile_eventos', 'nav_mobile_galeria', 'nav_mobile_parcerias', 'nav_mobile_equipe', 'nav_mobile_sobre',
  'hero_view_event', 'footer_linkedin', 'footer_instagram', 'footer_whatsapp', 'footer_github',
  'partner_card', 'partner_contact', 'team_social_link', 'team_social_linkedin', 'team_social_facebook',
  'team_social_github', 'team_social_instagram', 'event_details', 'past_event_details', 'event_not_found_back',
  'event_back', 'speaker_linkedin', 'event_registration',
] as const;

export class AnalyticsEventDto {
  @IsIn(['page_view', 'session_start', 'click', 'scroll_depth', 'engagement'])
  event: 'page_view' | 'session_start' | 'click' | 'scroll_depth' | 'engagement';

  @IsString() @Length(16, 128)
  visitorId: string;

  @IsString() @Length(1, 160)
  path: string;

  @IsIn(['desktop', 'mobile', 'tablet'])
  device: 'desktop' | 'mobile' | 'tablet';

  @IsIn(['direct', 'google', 'instagram', 'facebook', 'linkedin', 'github', 'other'])
  referrer: 'direct' | 'google' | 'instagram' | 'facebook' | 'linkedin' | 'github' | 'other';

  @IsOptional() @IsString() @IsIn(CLICK_TAGS)
  tag?: string;

  @IsOptional() @IsBoolean()
  outbound?: boolean;

  @IsOptional() @IsInt() @IsIn([25, 50, 75, 100])
  depth?: number;

  @IsOptional() @IsInt() @Min(0) @Max(3600)
  durationSeconds?: number;
}
