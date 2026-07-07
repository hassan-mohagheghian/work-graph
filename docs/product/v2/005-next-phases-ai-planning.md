j# 005 - Next Phases: AI Planning

## Purpose

Define the next build phases for turning project knowledge into roadmaps,
milestones, and tasks with AI.

The near-term product flow is:

```text
Project knowledge
  -> AI extraction
  -> Generated planning assets
  -> Human review
  -> Roadmap, milestones, and tasks
```

The key product rule is that AI output should be draft material until a user
reviews and accepts it.

---

## Current Position

WorkGraph already has the foundation for:

- Authentication
- Organizations
- Projects
- Tasks
- Documents
- Project-linked knowledge
- Attachment upload and download

The next phase should focus on making the knowledge-to-execution loop work.

---

## Phase A - Review Generated Assets

### Goal

Create a review workflow for AI-generated planning assets before they become
real project data.

### Why This Comes First

Roadmaps, milestones, and tasks generated from documents will be imperfect.
Users need a place to inspect, edit, approve, reject, and regenerate them.

### Deliverables

- Generated asset model
- Planning run model
- Review statuses: draft, accepted, rejected, applied
- Review UI for generated goals, roadmap items, milestones, and tasks
- Ability to edit generated items before applying them
- Audit trail showing source documents used for generation

### Suggested Data Concepts

- `PlanningRun`
- `GeneratedGoal`
- `GeneratedRoadmapItem`
- `GeneratedMilestone`
- `GeneratedTask`
- `GeneratedAssetSource`

### Acceptance Criteria

- A user can start a planning run from project documents.
- The system stores generated output as draft assets.
- The user can review the generated assets without creating tasks immediately.
- The user can accept, reject, or edit each generated asset.

---

## Phase B - AI Extraction Contract

### Goal

Define stable JSON contracts for AI output before implementing provider-specific
AI integration.

### Deliverables

- Prompt input schema
- AI output schema
- Validation layer for generated assets
- Error handling for malformed AI responses
- Test fixtures for representative documents

### Required AI Outputs

The first AI planning response should extract:

- Project goal
- Problem statement
- Success criteria
- Roadmap items
- Milestones
- Candidate tasks
- Risks or missing information

### Acceptance Criteria

- AI output can be validated before persistence.
- Invalid generated output does not affect project data.
- The same input document can be tested with a saved fixture.

---

## Phase C - AI Planning MVP

### Goal

Generate planning assets from project documents.

### Deliverables

- Backend planning endpoint
- AI planning service
- Document context builder
- Prompt template for roadmap, milestone, and task extraction
- Persistence for generated draft assets
- Frontend action to start generation from a project document set

### Suggested API Surface

```text
POST /projects/{project_id}/planning-runs
GET  /projects/{project_id}/planning-runs
GET  /planning-runs/{planning_run_id}
PATCH /generated-assets/{asset_id}
POST /planning-runs/{planning_run_id}/apply
```

### Acceptance Criteria

- A user can generate a draft roadmap from project documents.
- The generated roadmap includes milestones and candidate tasks.
- The generated output is tenant-aware and project-scoped.
- The generated output is not applied automatically.

---

## Phase D - Apply Reviewed Assets

### Goal

Convert accepted generated assets into real WorkGraph project objects.

### Deliverables

- Apply selected generated tasks to the existing task module
- Add milestone support if milestones are not yet implemented
- Link generated tasks back to source documents and planning run
- Preserve review decisions for traceability

### Acceptance Criteria

- Accepted generated tasks can be created as real tasks.
- Rejected generated tasks are never applied.
- Applied tasks keep a reference to the planning run or source document.
- Applying a planning run is idempotent.

---

## Phase E - Evaluation And Iteration

### Goal

Improve AI output quality through repeatable evaluation.

### Deliverables

- Golden document fixtures
- Expected planning output examples
- Manual scoring checklist
- Regression tests for output validation
- Product feedback fields on generated assets

### Quality Checklist

- Does the generated roadmap reflect the source documents?
- Are milestones ordered logically?
- Are tasks actionable?
- Are tasks small enough to execute?
- Are important risks or unknowns surfaced?
- Are tenant and project boundaries respected?

### Acceptance Criteria

- The team can compare AI output quality across prompt changes.
- Generated assets can be scored before release.
- Prompt changes do not silently break the output contract.

---

## Recommended Immediate Tasks

1. Update architecture docs to reflect that the Knowledge domain is now partly
   implemented.
2. Add backend models for planning runs and generated planning assets.
3. Add validation schemas for AI-generated roadmap, milestone, and task output.
4. Build a read-only generated-assets review page.
5. Add edit, accept, reject, and apply actions.
6. Implement the first AI planning service behind the generated asset contract.
7. Add fixture-based tests for generated output validation.

---

## First Demo Target

The next demo should show:

1. Create or open a project.
2. Add project documents.
3. Start an AI planning run.
4. Review generated goals, roadmap items, milestones, and tasks.
5. Edit or reject weak generated items.
6. Apply accepted tasks to the project.
7. View the created tasks in the existing task workflow.
