export interface WeddingSettings {
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  hero_photo_url: string;
  welcome_text: string;
  venue_name: string;
  venue_address: string;
  yandex_map_url: string;
  dress_code_text: string;
  footer_text: string;
  accent_color: string;
  secondary_color: string;
}

export interface ProgramItem {
  id: number;
  time: string;
  title: string;
  sort_order: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface RSVPData {
  attending: boolean;
  guests_count: number;
  comment: string;
  submitted_at: string;
}

export interface VenueItem {
  id: number;
  title: string;
  address: string;
  map_embed_url: string;
  map_link_url: string;
  sort_order: number;
}

export interface Invitation {
  guest_name: string;
  settings: WeddingSettings;
  program: ProgramItem[];
  faq: FAQItem[];
  venues: VenueItem[];
  rsvp?: RSVPData;
}

export interface SubmitRSVPRequest {
  attending: boolean;
  guests_count: number;
  comment: string;
}
