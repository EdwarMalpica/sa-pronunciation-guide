"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LanguageSelector } from "@/components/language-selector"
import { PhraseSelector } from "@/components/phrase-selector"
import { AudioPlayer } from "@/components/audio-player"
import { AudioRecorder } from "@/components/audio-recorder"
import { AudioComparison } from "@/components/audio-comparison"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Mic } from "lucide-react"
import type { Language, Phrase } from "@/types/pronunciation"
import { languages, phrases } from "@/data/pronunciation-data"

export function PronunciationGuide() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const [selectedPhrase, setSelectedPhrase] = useState<Phrase | null>(null)
  const [nativeAudioUrl, setNativeAudioUrl] = useState<string | null>(null)
  const [nativeAudioDuration, setNativeAudioDuration] = useState<number | null>(null)
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null)
  const [userAudioDuration, setUserAudioDuration] = useState<number | null>(null)
  const [comparisonResult, setComparisonResult] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("practice")

  // For confirmation dialogs
  const [showLanguageConfirm, setShowLanguageConfirm] = useState(false)
  const [showPhraseConfirm, setShowPhraseConfirm] = useState(false)
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null)
  const [pendingPhrase, setPendingPhrase] = useState<Phrase | null>(null)

  const handleLanguageChangeRequest = (language: Language) => {
    // If there's no recording, change immediately
    if (!userAudioUrl) {
      handleLanguageChange(language)
      return
    }

    // Otherwise, show confirmation dialog
    setPendingLanguage(language)
    setShowLanguageConfirm(true)
  }

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    setSelectedPhrase(null)
    setNativeAudioUrl(null)
    setNativeAudioDuration(null)
    setUserAudioUrl(null)
    setUserAudioDuration(null)
    setComparisonResult(null)
    setActiveTab("practice")
  }

  const handlePhraseSelectRequest = (phrase: Phrase) => {
    // If there's no recording or it's the same phrase, change immediately
    if (!userAudioUrl || phrase.id === selectedPhrase?.id) {
      handlePhraseSelect(phrase)
      return
    }

    // Otherwise, show confirmation dialog
    setPendingPhrase(phrase)
    setShowPhraseConfirm(true)
  }

  const handlePhraseSelect = (phrase: Phrase) => {
    setSelectedPhrase(phrase)

    // Set the audio URL directly - our AudioPlayer component will handle errors silently
    setNativeAudioUrl(phrase.audioUrl)
    setNativeAudioDuration(phrase.audioDuration)

    // Only reset recording if it's a different phrase
    if (selectedPhrase?.id !== phrase.id) {
      setUserAudioUrl(null)
      setUserAudioDuration(null)
      setComparisonResult(null)
      setActiveTab("practice")
    }
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

  const handleRecordAgain = () => {
    setActiveTab("practice")
  }

  return (
    <>
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
              onLanguageChange={handleLanguageChangeRequest}
            />

            <PhraseSelector
              phrases={phrases.filter((p) => p.languageId === selectedLanguage.id)}
              selectedPhrase={selectedPhrase}
              onPhraseSelect={handlePhraseSelectRequest}
            />

            {selectedPhrase && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                  <TabsTrigger value="compare" disabled={!userAudioUrl}>
                    Compare
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="practice" className="space-y-2 pt-4">
                  <AudioPlayer
                    audioUrl={nativeAudioUrl}
                    label="Native Speaker"
                    fallbackText={selectedPhrase.text}
                    language={selectedLanguage.id}
                    initialDuration={nativeAudioDuration || undefined}
                  />

                  <AudioRecorder
                    onRecordingComplete={handleRecordingComplete}
                    disabled={false} // Always allow recording
                  />
                </TabsContent>

                <TabsContent value="compare" className="space-y-6 pt-4">
                  <AudioComparison
                    nativeAudioUrl={nativeAudioUrl}
                    nativeAudioDuration={nativeAudioDuration}
                    userAudioUrl={userAudioUrl}
                    userAudioDuration={userAudioDuration}
                    comparisonResult={comparisonResult}
                    fallbackText={selectedPhrase?.text}
                    language={selectedLanguage.id}
                  />

                  <Button onClick={handleRecordAgain} className="w-full" variant="outline">
                    <Mic className="mr-2 h-4 w-4" />
                    Record Again
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Language Change */}
      <AlertDialog open={showLanguageConfirm} onOpenChange={setShowLanguageConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Language?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the language will discard your current recording. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingLanguage) {
                  handleLanguageChange(pendingLanguage)
                  setPendingLanguage(null)
                }
                setShowLanguageConfirm(false)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation Dialog for Phrase Change */}
      <AlertDialog open={showPhraseConfirm} onOpenChange={setShowPhraseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Phrase?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the phrase will discard your current recording. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingPhrase) {
                  handlePhraseSelect(pendingPhrase)
                  setPendingPhrase(null)
                }
                setShowPhraseConfirm(false)
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

