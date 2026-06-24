export type SharePlatform = 'whatsapp' | 'twitter' | 'facebook' | 'linkedin';

export interface ShareLink {
  readonly platform: SharePlatform;
  readonly label: string;
  readonly href: string;
}
