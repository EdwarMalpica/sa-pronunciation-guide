"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { Phrase } from "@/types/pronunciation"

interface PhraseSelectorProps {
  phrases: Phrase[]
  selectedPhrase: Phrase | null
  onPhraseSelect: (phrase: Phrase) => void
}

export function PhraseSelector({ phrases, selectedPhrase, onPhraseSelect }: PhraseSelectorProps) {
  if (phrases.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No phrases available for the selected language.</div>
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Select a phrase to practice</h3>
      <RadioGroup
        value={selectedPhrase?.id}
        onValueChange={(value) => {
          const phrase = phrases.find((p) => p.id === value)
          if (phrase) onPhraseSelect(phrase)
        }}
        className="space-y-2"
      >
        {phrases.map((phrase) => (
          <div key={phrase.id} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
            <RadioGroupItem value={phrase.id} id={phrase.id} />
            <Label htmlFor={phrase.id} className="flex-1 cursor-pointer">
              <div>
                <p className="font-medium">{phrase.text}</p>
                <p className="text-sm text-muted-foreground">{phrase.translation}</p>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

