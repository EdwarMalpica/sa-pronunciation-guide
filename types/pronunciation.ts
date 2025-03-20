export interface Language {
  id: string // Now using language codes like 'en-US', 'es-ES', etc.
  name: string
  flag: string
}

export interface Phrase {
  id: string
  languageId: string
  text: string
  translation: string
  audioUrl: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

