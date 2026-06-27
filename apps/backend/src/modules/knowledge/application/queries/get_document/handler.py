from fastapi import HTTPException

from src.modules.knowledge.application.queries.get_document.query import (
    GetDocumentQuery,
)
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo


class GetDocumentHandler:
    def __init__(self, document_repo: DocumentRepo):
        self.document_repo = document_repo

    async def handle(self, query: GetDocumentQuery):
        document = await self.document_repo.get_by_id(query.document_id)

        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        if document.org_id != query.org_id:
            raise HTTPException(status_code=403, detail="Not allowed")

        return document
