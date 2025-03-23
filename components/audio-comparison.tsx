"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface AudioComparisonProps {
  nativeAudioUrl: string | null
  nativeAudioDuration?: number | null
  userAudioUrl: string | null
  userAudioDuration?: number | null
  comparisonResult: number | null
  fallbackText?: string
  language?: string
}

export function AudioComparison({
  nativeAudioUrl,
  nativeAudioDuration,
  userAudioUrl,
  userAudioDuration,
  comparisonResult,
  fallbackText,
  language = "en-US",
}: AudioComparisonProps) {
  const nativeCanvasRef = useRef<HTMLCanvasElement>(null)
  const userCanvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Use resolvedTheme which gives the actual current theme
    const isDarkTheme = resolvedTheme === "dark"

    // Draw waveforms when component mounts or URLs change or theme changes
    if (nativeCanvasRef.current) {
      drawFallbackWaveform(nativeCanvasRef.current, "rgb(124, 58, 237)", isDarkTheme)
    }

    if (userCanvasRef.current) {
      drawFallbackWaveform(userCanvasRef.current, "rgb(239, 68, 68)", isDarkTheme)
    }

    // Try to visualize the user recording if it's a blob URL
    if (userAudioUrl && userAudioUrl.startsWith("blob:") && userCanvasRef.current) {
      visualizeAudio(userAudioUrl, userCanvasRef.current, "rgb(239, 68, 68)", isDarkTheme)
    }
  }, [nativeAudioUrl, userAudioUrl, theme, resolvedTheme, mounted])

  // Function to visualize audio from a URL
  const visualizeAudio = async (url: string, canvas: HTMLCanvasElement, color: string, isDarkTheme: boolean) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()

      audioContext.decodeAudioData(
        arrayBuffer,
        (audioBuffer) => {
          const data = audioBuffer.getChannelData(0)
          drawWaveform(canvas, data, color, isDarkTheme)
        },
        () => {
          // Silently fall back to default waveform on error
          drawFallbackWaveform(canvas, color, isDarkTheme)
        },
      )
    } catch {
      // Silently fall back to default waveform on error
      drawFallbackWaveform(canvas, color, isDarkTheme)
    }
  }

  // Function to draw waveform from audio data
  const drawWaveform = (canvas: HTMLCanvasElement, audioData: Float32Array, color: string, isDarkTheme: boolean) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Set background color based on theme
    ctx.fillStyle = isDarkTheme ? "rgb(20, 20, 20)" : "rgb(240, 240, 240)"
    ctx.fillRect(0, 0, width, height)

    // Reduce data to fit canvas width
    const sliceWidth = width / 100
    const dataStep = Math.floor(audioData.length / 100)

    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    for (let i = 0; i < 100; i++) {
      // Get average amplitude for this slice
      let sum = 0
      for (let j = 0; j < dataStep; j++) {
        const index = i * dataStep + j
        if (index < audioData.length) {
          sum += Math.abs(audioData[index])
        }
      }
      const average = sum / dataStep

      // Draw bar
      const barHeight = average * height * 3 // Amplify for visibility
      ctx.fillStyle = color
      ctx.fillRect(i * sliceWidth, height - barHeight, sliceWidth - 1, barHeight)
    }
  }

  // Fallback waveform if audio analysis fails
  const drawFallbackWaveform = (canvas: HTMLCanvasElement, color: string, isDarkTheme: boolean) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)

    // Set background color based on theme
    ctx.fillStyle = isDarkTheme ? "rgb(20, 20, 20)" : "rgb(240, 240, 240)"
    ctx.fillRect(0, 0, width, height)

    const points = 50
    const barWidth = width / points

    for (let i = 0; i < points; i++) {
      // Use sine wave with some randomness for natural look
      const randomFactor = Math.sin(i * 0.2) * 0.3 + 0.7
      const barHeight = Math.abs(Math.sin(i * 0.2) * randomFactor * height * 0.7)

      ctx.fillStyle = color
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight)
    }
  }

  const getFeedbackText = (score: number) => {
    if (score >= 90) return "Excellent! Your pronunciation is very close to native."
    if (score >= 80) return "Great job! Your pronunciation is good."
    if (score >= 70) return "Good effort! Keep practicing to improve further."
    return "Keep practicing! Try to match the native speaker more closely."
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 80) return "bg-emerald-500"
    if (score >= 70) return "bg-amber-500"
    return "bg-red-500"
  }

  if (!userAudioUrl) {
    return <div className="text-center py-4 text-muted-foreground">Please record your pronunciation first.</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <AudioPlayer
            audioUrl={nativeAudioUrl}
            label="Native Speaker"
            fallbackText={fallbackText}
            language={language}
            initialDuration={nativeAudioDuration || undefined}
          />
          <canvas
            ref={nativeCanvasRef}
            width="300"
            height="100"
            className="w-full h-24 mt-4 rounded-md border"
          ></canvas>
        </div>

        <div>
          <AudioPlayer
            audioUrl={userAudioUrl}
            label="Your Recording"
            initialDuration={userAudioDuration || undefined}
          />
          <canvas ref={userCanvasRef} width="300" height="100" className="w-full h-24 mt-4 rounded-md border"></canvas>
        </div>
      </div>

      {comparisonResult !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pronunciation Accuracy</h3>
                {/* Custom badge without hover effect */}
                <div
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-none",
                    getScoreColor(comparisonResult),
                    "text-white",
                  )}
                >
                  {comparisonResult}%
                </div>
              </div>

              <Progress value={comparisonResult} className="h-2" />

              <p className="text-sm text-muted-foreground">{getFeedbackText(comparisonResult)}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

