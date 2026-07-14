"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useOrg } from "@/shared/context/org-context";
import { useDocuments } from "@/features/document/hooks/use-documents";
import { useUploadAttachment } from "@/features/document/hooks/use-upload-attachment";
import { CreateDocumentSheet } from "@/features/document/components/create-document-dialog";
import { EditDocumentSheet } from "@/features/document/components/edit-document-sheet";
import { SectionHeader } from "@/shared/layout/page-layout";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Paperclip, Plus } from "lucide-react";

export default function ProjectDocumentsPage() {
  const params = useParams();
  const orgId = params.organizationId as string;
  const projectId = params.projectId as string;

  const { setOrgId } = useOrg();

  useEffect(() => {
    if (orgId) setOrgId(orgId);
  }, [orgId, setOrgId]);

  const { data: documents = [], isLoading } = useDocuments(orgId, {
    target_type: "project",
    target_id: projectId,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [editDocId, setEditDocId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  function handleOpenDoc(docId: string) {
    setEditDocId(docId);
    setEditOpen(true);
  }

  if (isLoading) return <p>Loading documents...</p>;

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Documents"
        description="Store project knowledge for AI planning"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4 mr-1" />
            Create Document
          </Button>
        }
      />

      {documents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No documents yet. Create one to capture requirements and attachments.
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="size-4 mr-1" />
              Create Document
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {documents.map((doc) => (
          <Card
            key={doc.id}
            className="group cursor-pointer hover:shadow-md transition"
            onClick={() => handleOpenDoc(doc.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium truncate">{doc.title}</h3>
                {doc.attachments.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full shrink-0">
                    <Paperclip className="size-3" />
                    {doc.attachments.length}
                  </span>
                )}
              </div>
              {doc.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {doc.description}
                </p>
              )}
              {!doc.description && (
                <p className="text-sm text-muted-foreground italic">
                  No description
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateDocumentSheet
        projectId={projectId}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      {editDocId && (
        <EditDocumentSheet
          documentId={editDocId}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </div>
  );
}
