import { PronunciationGuide } from "@/components/pronunciation-guide"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-8">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Pronunciation Guide</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Improve your pronunciation skills by comparing your voice with native speakers
        </p>
      </div>
      <PronunciationGuide />
    </div>
  )
}

