# Knowledge Domain

## Purpose

Manage documents and organizational knowledge for AI-assisted planning.

## Entities

### Document

- `id` (UUID)
- `project_id` (UUID, FK)
- `title` (str)
- `description` (str, optional)
- `created_at`, `updated_at`

### Attachment

- `id` (UUID)
- `document_id` (UUID, FK)
- `filename` (str)
- `url` (str)
- `content_type` (str)
- `size` (int)
- `created_at`

## API Endpoints

- `POST /documents` — Create document
- `GET /documents` — List documents (filters: target_type, target_id)
- `GET /documents/{id}` — Get document
- `PATCH /documents/{id}` — Update document
- `DELETE /documents/{id}` — Delete document
- `POST /documents/{id}/attachments` — Upload attachment
- `DELETE /documents/{id}/attachments/{attachment_id}` — Delete attachment

## Status

Implemented. Documents are project-scoped and serve as input for future AI planning.

## Next Phase

Documents will be used as context for AI planning runs to generate roadmaps, milestones, and tasks.
