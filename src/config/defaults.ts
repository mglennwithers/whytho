import {
  DEFAULT_AI_PROVIDER,
  DEFAULT_AI_MODEL,
  DEFAULT_INFER_MODEL,
  DEFAULT_CONFIDENCE_THRESHOLD,
  DEFAULT_SUPERSEDED_THRESHOLD,
} from '../core/constants.js'
import type { WhythoConfig } from './types.js'

export const DEFAULT_CONFIG: WhythoConfig = {
  specVersion: '1.0',
  aiProvider: DEFAULT_AI_PROVIDER,
  anthropic: {
    annotationModel: DEFAULT_AI_MODEL,
    inferModel: DEFAULT_INFER_MODEL,
    apiKeyEnv: 'ANTHROPIC_API_KEY',
  },
  resolution: {
    confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
    supersededThreshold: DEFAULT_SUPERSEDED_THRESHOLD,
    runOnCommit: true,
    hookMode: 'post-commit',
  },
  parser: {
    additionalPlugins: [],
  },
  hooks: {},
  privacy: {
    omitUser: false,
  },
}
