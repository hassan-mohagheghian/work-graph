import { api } from "@/shared/lib/api";
import type { Document, LinkTargetType } from "../types/document";

export async function getDocuments(
  orgId: string,
  filters?: { target_type?: LinkTargetType; target_id?: string },
): Promise<Document[]> {
  const res = await api.get("/documents", {
    params: { org_id: orgId, ...filters },
  });
  return res.data;
}

export async function getDocument(orgId: string, documentId: string): Promise<Document> {
  const res = await api.get(`/documents/${documentId}`, {
    params: { org_id: orgId },
  });
  return res.data;
}

export async function createDocument(data: {
  org_id: string;
  title: string;
  description?: string;
  links: { target_type: LinkTargetType; target_id: string }[];
}): Promise<Document> {
  const res = await api.post(`/documents?org_id=${data.org_id}`, {
    title: data.title,
    description: data.description,
    links: data.links,
  });
  return res.data;
}

export async function updateDocument(
  orgId: string,
  documentId: string,
  data: { title?: string; description?: string },
): Promise<Document> {
  const res = await api.patch(`/documents/${documentId}?org_id=${orgId}`, data);
  return res.data;
}

export async function deleteDocument(orgId: string, documentId: string): Promise<void> {
  await api.delete(`/documents/${documentId}?org_id=${orgId}`);
}

export async function uploadAttachment(
  orgId: string,
  documentId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/documents/${documentId}/attachments?org_id=${orgId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return res.data;
}

export async function deleteAttachment(
  orgId: string,
  documentId: string,
  attachmentId: string,
): Promise<void> {
  await api.delete(
    `/documents/${documentId}/attachments/${attachmentId}?org_id=${orgId}`,
  );
}

export function getAttachmentDownloadUrl(
  orgId: string,
  documentId: string,
  attachmentId: string,
): string {
  return `http://localhost:8000/documents/${documentId}/attachments/${attachmentId}/download?org_id=${orgId}`;
}
