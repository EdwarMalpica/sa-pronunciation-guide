"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import { PhraseSelector } from "@/components/phrase-selector"
import { AudioPlayer } from "@/components/audio-player"
import { AudioRecorder } from "@/components/audio-recorder"
import { AudioComparison } from "@/components/audio-comparison"
import type { Language, Phrase } from "@/types/pronunciation"
import { languages, phrases } from "@/data/pronunciation-data"

export function PronunciationGuide() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)
  const [nativeAudioUrl, setNativeAudioUrl] = useState<string | null>(null)
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null)
  const [userAudioDuration, setUserAudioDuration] = useState<number | null>(null)
  const [comparisonResult, setComparisonResult] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("practice")

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    setSelectedPhrase(null)
    setNativeAudioUrl(null)
    setUserAudioUrl(null)
    setUserAudioDuration(null)
    setComparisonResult(null)
  }

  const handlePhraseSelect = (phrase: Phrase) => {
    setSelectedPhrase(phrase)

    // Set the audio URL directly - our AudioPlayer component will handle errors silently
    setNativeAudioUrl(phrase.audioUrl)

    setUserAudioUrl(null)
    setUserAudioDuration(null)
    setComparisonResult(null)

    // Reset to practice tab when selecting a new phrase
    setActiveTab("practice")
  }

  const handleRecordingComplete = (audioUrl: string, duration: number) => {
    setUserAudioUrl(audioUrl)
    setUserAudioDuration(duration)

    // Simulate comparison result
    // In a real app, this would be calculated by comparing the audio waveforms
    const simulatedAccuracy = Math.floor(Math.random() * 41) + 60 // Random number between 60-100
    setComparisonResult(simulatedAccuracy)
    setActiveTab("compare")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Pronunciation Practice</CardTitle>
        <CardDescription>
          Select a language and phrase, listen to the native pronunciation, and record your voice to compare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <LanguageSelector
            languages={languages}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />

          <PhraseSelector
            phrases={phrases.filter((p) => p.languageId === selectedLanguage.id)}
            selectedPhrase={selectedPhrase}
            onPhraseSelect={handlePhraseSelect}
          />

          {selectedPhrase && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="compare" disabled={!userAudioUrl}>
                  Compare
                </TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-6 pt-4">
                <AudioPlayer
                  audioUrl={nativeAudioUrl}
                  label="Native Speaker"
                  fallbackText={selectedPhrase.text}
                  language={selectedLanguage.id}
                />

                <AudioRecorder
                  onRecordingComplete={handleRecordingComplete}
                  disabled={false} // Always allow recording
                />
              </TabsContent>

              <TabsContent value="compare" className="space-y-6 pt-4">
                <AudioComparison
                  nativeAudioUrl={nativeAudioUrl}
                  userAudioUrl={userAudioUrl}
                  userAudioDuration={userAudioDuration}
                  comparisonResult={comparisonResult}
                  fallbackText={selectedPhrase?.text}
                  language={selectedLanguage.id}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

