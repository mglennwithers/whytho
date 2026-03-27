---
whytho: "1.0"
type: file
path: src/ai/providers/gemini.ts
created: "2026-03-24T18:47:56.190Z"
updated: "2026-03-27T22:45:41.283Z"
updated_by_session: static-scan
parent_folder: src/ai/providers/
sessions: []
blocks: []
relationships:
  - type: depends_on
    target: src/ai/types.ts::AIProvider
    source: static
  - type: depends_on
    target: src/ai/types.ts::AnnotationRequest
    source: static
  - type: depends_on
    target: src/ai/types.ts::AnnotationResult
    source: static
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchRequest
    source: static
  - type: depends_on
    target: src/ai/types.ts::SemanticMatchResult
    source: static
  - type: depends_on
    target: src/ai/types.ts::AssessPushNotesRequest
    source: static
  - type: depends_on
    target: src/ai/types.ts::AssessPushNotesResult
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-block.ts::buildBlockAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-block.ts::parseBlockAnnotationResponse
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-file.ts::buildFileAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-folder.ts::buildFolderAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/annotate-session.ts::buildSessionAnnotationPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/semantic-match.ts::buildSemanticMatchPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/semantic-match.ts::parseSemanticMatchResponse
    source: static
  - type: depends_on
    target: src/ai/prompts/assess-push-notes.ts::buildAssessPushNotesPrompt
    source: static
  - type: depends_on
    target: src/ai/prompts/assess-push-notes.ts::parseAssessPushNotesResponse
    source: static
  - type: depends_on
    target: src/core/constants.ts::WHYTHO_VERSION
    source: static
  - type: depends_on
    target: src/core/constants.ts::DEFAULT_GEMINI_MODEL
    source: static
---


