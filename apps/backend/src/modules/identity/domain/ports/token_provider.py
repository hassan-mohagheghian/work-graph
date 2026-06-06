from abc import ABC, abstractmethod


class TokenProvider:
    @abstractmethod
    def generate_token(self, user_id: str) -> str:
        pass
