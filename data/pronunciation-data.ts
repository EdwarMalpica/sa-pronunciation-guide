import type { Language, Phrase } from "@/types/pronunciation"

export const languages: Language[] = [
  {
    id: "es-ES",
    name: "Spanish",
    flag: "🇪🇸",
  },
  {
    id: "fr-FR",
    name: "French",
    flag: "🇫🇷",
  },
  {
    id: "de-DE",
    name: "German",
    flag: "🇩🇪",
  },
  {
    id: "ja-JP",
    name: "Japanese",
    flag: "🇯🇵",
  },
  {
    id: "zh-CN",
    name: "Mandarin",
    flag: "🇨🇳",
  },
]

// Using sample audio files that are more likely to work across browsers
// In a real app, you would host these files on your own server
export const phrases: Phrase[] = [
  // Spanish phrases
  {
    id: "es-1",
    languageId: "es-ES",
    text: "Buenos días",
    translation: "Good morning",
    // Using a reliable source for audio files or just rely on speech synthesis
    audioUrl: "/placeholder.svg?height=1&width=1", // This will trigger fallback to speech synthesis
    audioDuration: 1.5, // Hardcoded duration in seconds
    difficulty: "beginner",
  },
  {
    id: "es-2",
    languageId: "es-ES",
    text: "¿Cómo estás?",
    translation: "How are you?",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.2,
    difficulty: "beginner",
  },
  {
    id: "es-3",
    languageId: "es-ES",
    text: "Mucho gusto en conocerte",
    translation: "Nice to meet you",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 2.5,
    difficulty: "intermediate",
  },

  // French phrases
  {
    id: "fr-1",
    languageId: "fr-FR",
    text: "Bonjour",
    translation: "Hello",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.0,
    difficulty: "beginner",
  },
  {
    id: "fr-2",
    languageId: "fr-FR",
    text: "Comment allez-vous?",
    translation: "How are you?",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.8,
    difficulty: "beginner",
  },
  {
    id: "fr-3",
    languageId: "fr-FR",
    text: "Je suis enchanté de faire votre connaissance",
    translation: "I am delighted to meet you",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 3.2,
    difficulty: "intermediate",
  },

  // German phrases
  {
    id: "de-1",
    languageId: "de-DE",
    text: "Guten Tag",
    translation: "Good day",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.2,
    difficulty: "beginner",
  },
  {
    id: "de-2",
    languageId: "de-DE",
    text: "Wie geht es Ihnen?",
    translation: "How are you?",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.7,
    difficulty: "beginner",
  },
  {
    id: "de-3",
    languageId: "de-DE",
    text: "Es freut mich, Sie kennenzulernen",
    translation: "I am pleased to meet you",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 2.8,
    difficulty: "intermediate",
  },

  // Japanese phrases
  {
    id: "ja-1",
    languageId: "ja-JP",
    text: "おはようございます",
    translation: "Good morning",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 2.0,
    difficulty: "beginner",
  },
  {
    id: "ja-2",
    languageId: "ja-JP",
    text: "お元気ですか",
    translation: "How are you?",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.5,
    difficulty: "beginner",
  },
  {
    id: "ja-3",
    languageId: "ja-JP",
    text: "はじめまして、よろしくお願いします",
    translation: "Nice to meet you, please treat me well",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 3.5,
    difficulty: "intermediate",
  },

  // Mandarin phrases
  {
    id: "zh-1",
    languageId: "zh-CN",
    text: "你好",
    translation: "Hello",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 0.8,
    difficulty: "beginner",
  },
  {
    id: "zh-2",
    languageId: "zh-CN",
    text: "你好吗？",
    translation: "How are you?",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 1.2,
    difficulty: "beginner",
  },
  {
    id: "zh-3",
    languageId: "zh-CN",
    text: "很高兴认识你",
    translation: "Nice to meet you",
    audioUrl: "/placeholder.svg?height=1&width=1",
    audioDuration: 2.0,
    difficulty: "intermediate",
  },
]

