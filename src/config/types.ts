export interface WhythoConfig {
  specVersion: '1.0'
  aiProvider: string
  anthropic?: {
    model?: string
    apiKeyEnv?: string
  }
  resolution: {
    confidenceThreshold: number
    supersededThreshold: number
    runOnCommit: boolean
    hookMode: 'post-commit' | 'pre-commit'
  }
  parser: {
    additionalPlugins: string[]
  }
  hooks: {
    onRelationshipChanged?: string
    webhookUrl?: string
  }
  privacy: {
    omitUser: boolean
  }
}
