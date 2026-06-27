from src.modules.knowledge.application.queries.list_documents.query import (
    ListDocumentsQuery,
)
from src.modules.knowledge.domain.repos.document_repo import DocumentRepo


class ListDocumentsHandler:
    def __init__(self, document_repo: DocumentRepo):
        self.document_repo = document_repo

    async def handle(self, query: ListDocumentsQuery):
        return await self.document_repo.list(
            org_id=query.org_id,
            target_type=query.target_type,
            target_id=query.target_id,
            limit=query.limit,
            offset=query.offset,
        )
