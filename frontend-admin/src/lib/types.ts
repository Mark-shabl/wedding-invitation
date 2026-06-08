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

export interface Guest {
  id: number;
  name: string;
  token: string;
  invite_url: string;
  created_at: string;
  rsvp?: {
    attending: boolean;
    guests_count: number;
    comment: string;
    submitted_at: string;
  };
}

export interface RSVPDTO {
  id: number;
  guest_id: number;
  guest_name: string;
  attending: boolean;
  guests_count: number;
  comment: string;
  submitted_at: string;
}

export interface DashboardStats {
  total_guests: number;
  confirmed: number;
  declined: number;
  no_response: number;
  total_attendees: number;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
}
