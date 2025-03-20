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
    audioUrl:
      "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/bu/buenos_d%C3%ADas_es_es_1.mp3",
    difficulty: "beginner",
  },
  {
    id: "es-2",
    languageId: "es-ES",
    text: "¿Cómo estás?",
    translation: "How are you?",
    audioUrl:
      "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/c%C3%B3/c%C3%B3mo_est%C3%A1s_es_es_1.mp3",
    difficulty: "beginner",
  },
  {
    id: "es-3",
    languageId: "es-ES",
    text: "Mucho gusto en conocerte",
    translation: "Nice to meet you",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/mu/mucho_gusto_es_es_1.mp3",
    difficulty: "intermediate",
  },

  // French phrases
  {
    id: "fr-1",
    languageId: "fr-FR",
    text: "Bonjour",
    translation: "Hello",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/bo/bonjour_fr_fr_1.mp3",
    difficulty: "beginner",
  },
  {
    id: "fr-2",
    languageId: "fr-FR",
    text: "Comment allez-vous?",
    translation: "How are you?",
    audioUrl:
      "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/co/comment_allez-vous_fr_fr_1.mp3",
    difficulty: "beginner",
  },
  {
    id: "fr-3",
    languageId: "fr-FR",
    text: "Je suis enchanté de faire votre connaissance",
    translation: "I am delighted to meet you",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/en/enchant%C3%A9_fr_fr_1.mp3",
    difficulty: "intermediate",
  },

  // German phrases
  {
    id: "de-1",
    languageId: "de-DE",
    text: "Guten Tag",
    translation: "Good day",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/gu/guten_tag_de_de_1.mp3",
    difficulty: "beginner",
  },
  {
    id: "de-2",
    languageId: "de-DE",
    text: "Wie geht es Ihnen?",
    translation: "How are you?",
    audioUrl:
      "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/wi/wie_geht_es_ihnen_de_de_1.mp3",
    difficulty: "beginner",
  },
  {
    id: "de-3",
    languageId: "de-DE",
    text: "Es freut mich, Sie kennenzulernen",
    translation: "I am pleased to meet you",
    audioUrl: "https://ssl.gstatic.com/dictionary/static/pronunciation/2022-03-02/audio/es/es_freut_mich_de_de_1.mp3",
    difficulty: "intermediate",
  },

  // Japanese phrases
  {
    id: "ja-1",
    languageId: "ja-JP",
    text: "おはようございます",
    translation: "Good morning",
    audioUrl: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=おはようございます",
    difficulty: "beginner",
  },
  {
    id: "ja-2",
    languageId: "ja-JP",
    text: "お元気ですか",
    translation: "How are you?",
    audioUrl: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=お元気ですか",
    difficulty: "beginner",
  },
  {
    id: "ja-3",
    languageId: "ja-JP",
    text: "はじめまして、よろしくお願いします",
    translation: "Nice to meet you, please treat me well",
    audioUrl: "https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kana=はじめまして",
    difficulty: "intermediate",
  },

  // Mandarin phrases
  {
    id: "zh-1",
    languageId: "zh-CN",
    text: "你好",
    translation: "Hello",
    audioUrl: "https://assets.languagepod101.com/dictionary/chinese/audiomp3.php?kana=你好",
    difficulty: "beginner",
  },
  {
    id: "zh-2",
    languageId: "zh-CN",
    text: "你好吗？",
    translation: "How are you?",
    audioUrl: "https://assets.languagepod101.com/dictionary/chinese/audiomp3.php?kana=你好吗",
    difficulty: "beginner",
  },
  {
    id: "zh-3",
    languageId: "zh-CN",
    text: "很高兴认识你",
    translation: "Nice to meet you",
    audioUrl: "https://assets.languagepod101.com/dictionary/chinese/audiomp3.php?kana=很高兴认识你",
    difficulty: "intermediate",
  },
]

