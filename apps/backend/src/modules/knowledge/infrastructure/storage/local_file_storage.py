from uuid import UUID, uuid4
from pathlib import Path

from src.modules.knowledge.domain.ports.file_storage import FileStoragePort
from src.shared.config.settings import settings


class LocalFileStorage(FileStoragePort):
    def __init__(self, base_path: str | None = None):
        self.base_path = Path(base_path or settings.STORAGE_PATH)
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def save(
        self,
        org_id: UUID,
        document_id: UUID,
        filename: str,
        content: bytes,
    ) -> str:
        safe_name = Path(filename).name
        storage_key = f"{org_id}/{document_id}/{uuid4()}_{safe_name}"
        file_path = self.base_path / storage_key
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_bytes(content)
        return storage_key

    async def delete(self, storage_key: str) -> None:
        file_path = self.base_path / storage_key
        if file_path.exists():
            file_path.unlink()

    def resolve_path(self, storage_key: str) -> str:
        return str(self.base_path / storage_key)
