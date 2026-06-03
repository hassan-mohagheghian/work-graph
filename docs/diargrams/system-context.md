# WorkGraph System Context

```mermaid
graph LR
    User --> WorkGraph
    WorkGraph --> PostgreSQL
    WorkGraph --> Redis
    WorkGraph --> OpenAI
