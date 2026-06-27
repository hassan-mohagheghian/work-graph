export type LinkTargetType = "project" | "task";

export interface DocumentLink {
  id: string;
  target_type: LinkTargetType;
  target_id: string;
  created_at: string;
}

export interface DocumentAttachment {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
}

export interface Document {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  links: DocumentLink[];
  attachments: DocumentAttachment[];
}
