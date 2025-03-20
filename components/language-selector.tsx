"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Language } from "@/types/pronunciation"

interface LanguageSelectorProps {
  languages: Language[]
  selectedLanguage: Language
  onLanguageChange: (language: Language) => void
}

export function LanguageSelector({ languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="language-select" className="text-sm font-medium">
        Select Language
      </label>
      <Select
        value={selectedLanguage.id}
        onValueChange={(value) => {
          const language = languages.find((lang) => lang.id === value)
          if (language) onLanguageChange(language)
        }}
      >
        <SelectTrigger id="language-select" className="w-full">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.id} value={language.id}>
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

