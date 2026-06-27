"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { useDocuments } from "@/features/document/hooks/use-documents";
import { useUpdateDocument } from "@/features/document/hooks/use-update-document";
import { useDeleteDocument } from "@/features/document/hooks/use-delete-document";
import { useUploadAttachment } from "@/features/document/hooks/use-upload-attachment";
import { CreateDocumentDialog } from "@/features/document/components/create-document-dialog";
import { getAttachmentDownloadUrl } from "@/features/document/api/document.api";
import type { Document } from "@/features/document/types/document";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export default function ProjectDocumentsPage() {
  const params = useParams();
  const orgId = params.id as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: documents = [], isLoading } = useDocuments(orgId, {
    target_type: "project",
    target_id: projectId,
  });

  const updateDocument = useUpdateDocument(orgId);
  const deleteDocument = useDeleteDocument(orgId);
  const uploadAttachment = useUploadAttachment(orgId);

  const [edit, setEdit] = useState<Record<string, Document>>({});
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  if (isLoading) return <p>Loading documents...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Documents</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Store project knowledge for AI planning (roadmaps, milestones, tasks)
          </p>
        </div>
        <CreateDocumentDialog projectId={projectId} />
      </div>

      {documents.length === 0 && (
        <Card>
          <CardContent className="p-6 text-muted-foreground">
            No documents yet. Create one to capture requirements and attachments.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {documents.map((doc) => {
          const local = edit[doc.id] ?? doc;

          function patchDocument(patch: Partial<Document>) {
            const updated = { ...local, ...patch };
            setEdit((prev) => ({ ...prev, [doc.id]: updated }));
            updateDocument.mutate({
              documentId: doc.id,
              data: {
                title: patch.title,
                description: patch.description,
              },
            });
          }

          return (
            <Card key={doc.id}>
              <CardContent className="p-4 space-y-3">
                <Input
                  value={local.title}
                  onChange={(e) => patchDocument({ title: e.target.value })}
                />

                <textarea
                  className="w-full border rounded-md p-2 text-sm min-h-[80px]"
                  value={local.description || ""}
                  placeholder="Description"
                  onChange={(e) => patchDocument({ description: e.target.value })}
                />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Attachments</p>
                  {doc.attachments.length === 0 && (
                    <p className="text-sm text-muted-foreground">No files attached</p>
                  )}
                  <ul className="space-y-1">
                    {doc.attachments.map((att) => (
                      <li key={att.id} className="text-sm">
                        <a
                          href={getAttachmentDownloadUrl(orgId, doc.id, att.id)}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {att.filename}
                        </a>
                        <span className="text-muted-foreground ml-2">
                          ({Math.round(att.size_bytes / 1024)} KB)
                        </span>
                      </li>
                    ))}
                  </ul>

                  <input
                    type="file"
                    ref={(el) => {
                      fileInputs.current[doc.id] = el;
                    }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadAttachment.mutate({ documentId: doc.id, file });
                        e.target.value = "";
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputs.current[doc.id]?.click()}
                  >
                    Upload file
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDocument.mutate(doc.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
