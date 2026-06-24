export interface ContactRequest {
  name: string;
  email?: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}
