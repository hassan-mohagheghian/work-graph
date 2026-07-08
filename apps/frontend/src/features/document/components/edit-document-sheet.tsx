"use client";

import { useEffect, useRef, useState } from "react";
import { useUpdateDocument } from "../hooks/use-update-document";
import { useDeleteDocument } from "../hooks/use-delete-document";
import { useUploadAttachment } from "../hooks/use-upload-attachment";
import { useDeleteAttachment } from "../hooks/use-delete-attachment";
import { useDocument } from "../hooks/use-document";
import { useOrg } from "@/shared/context/org-context";
import { getAttachmentDownloadUrl } from "../api/document.api";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/shared/ui/sheet";
import { Paperclip, Upload, Trash2, Download } from "lucide-react";

interface EditDocumentSheetProps {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDocumentSheet({
  documentId,
  open,
  onOpenChange,
}: EditDocumentSheetProps) {
  const { orgId } = useOrg();
  const { data: doc, isLoading } = useDocument(orgId, open ? documentId : undefined);

  const updateDocument = useUpdateDocument(orgId);
  const deleteDocument = useDeleteDocument(orgId);
  const uploadAttachment = useUploadAttachment(orgId);
  const deleteAttachment = useDeleteAttachment(orgId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (doc && open) {
      setTitle(doc.title);
      setDescription(doc.description || "");
    }
  }, [doc, open]);

  if (!doc && !isLoading) return null;

  function handleSave() {
    if (!title.trim()) return;

    updateDocument.mutate(
      {
        documentId,
        data: {
          title,
          description: description || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  }

  function handleDelete() {
    deleteDocument.mutate(documentId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      uploadAttachment.mutate({ documentId, file });
      e.target.value = "";
    }
  }

  function handleDeleteAttachment(attachmentId: string) {
    deleteAttachment.mutate({
      documentId,
      attachmentId,
    });
  }

  const isUploading = uploadAttachment.isPending;
  const isDeletingAtt = deleteAttachment.isPending;
  const attachments = doc?.attachments ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader>
          <SheetTitle>Edit Document</SheetTitle>
          <SheetDescription>
            Update document details and manage attachments.
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="doc-title">Title</Label>
              <Input
                id="doc-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="doc-description">Description</Label>
              <textarea
                id="doc-description"
                className="w-full border rounded-md p-2 text-sm min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Requirements, notes, goals..."
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Attachments ({attachments.length})</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="size-3 mr-1" />
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {attachments.length === 0 && !isUploading ? (
                <div className="text-center py-6 border border-dashed rounded-lg">
                  <Paperclip className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No files attached yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click &quot;Upload File&quot; to add attachments
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {isUploading && (
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/50 animate-pulse">
                      <div className="p-1.5 rounded bg-background">
                        <Upload className="size-3.5 text-muted-foreground animate-bounce" />
                      </div>
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  )}
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded bg-background">
                          <Paperclip className="size-3.5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {att.filename}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(att.size_bytes)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={getAttachmentDownloadUrl(orgId!, documentId, att.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-background rounded transition-colors"
                          title="Download"
                        >
                          <Download className="size-3.5 text-muted-foreground" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteAttachment(att.id)}
                          disabled={isDeletingAtt}
                          title="Delete attachment"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <SheetFooter className="flex-row justify-between">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteDocument.isPending}
          >
            <Trash2 className="size-3 mr-1" />
            Delete Document
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateDocument.isPending}
            >
              {updateDocument.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
