export interface UserDetail {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  profile_photo_url?: string;
  preferences: UserPreferences;
  security: UserSecurity;
}

export interface UserPreferences {
  ui_theme: "light" | "dark";
  notifications_enabled: boolean;
  language: "en" | "es" | "fr" | "de" | "zh";
}

export interface UserSecurity {
  mfa_enabled: boolean;
  last_password_change: string; // ISO datetime
}

export interface ActivitySummary {
  recent_conversations: number;
  documents_viewed: number;
  last_login: string;
}
