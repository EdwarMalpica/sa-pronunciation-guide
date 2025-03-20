"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { AudioPlayer } from "@/components/audio-player"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface AudioComparisonProps {
  nativeAudioUrl: string | null
  userAudioUrl: string | null
  comparisonResult: number | null
  fallbackText?: string
  language?: string
}

export function AudioComparison({
  nativeAudioUrl,
  userAudioUrl,
  comparisonResult,
  fallbackText,
  language = "en-US",
}: AudioComparisonProps) {
  const nativeCanvasRef = useRef<HTMLCanvasElement>(null)
  const userCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Draw waveforms when component mounts or URLs change
    if (nativeCanvasRef.current) {
      drawFallbackWaveform(nativeCanvasRef.current, "rgb(124, 58, 237)")
    }

    if (userCanvasRef.current) {
      drawFallbackWaveform(userCanvasRef.current, "rgb(239, 68, 68)")
    }

    // Try to visualize the user recording if it's a blob URL
    if (userAudioUrl && userAudioUrl.startsWith("blob:") && userCanvasRef.current) {
      visualizeAudio(userAudioUrl, userCanvasRef.current, "rgb(239, 68, 68)")
    }
  }, [nativeAudioUrl, userAudioUrl])

  // Function to visualize audio from a URL
  const visualizeAudio = async (url: string, canvas: HTMLCanvasElement, color: string) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()

      audioContext.decodeAudioData(
        arrayBuffer,
        (audioBuffer) => {
          const data = audioBuffer.getChannelData(0)
          drawWaveform(canvas, data, color)
        },
        () => {
          // Silently fall back to default waveform on error
          drawFallbackWaveform(canvas, color)
        },
      )
    } catch {
      // Silently fall back to default waveform on error
      drawFallbackWaveform(canvas, color)
    }
  }

  // Function to draw waveform from audio data
  const drawWaveform = (canvas: HTMLCanvasElement, audioData: Float32Array, color: string) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgb(20, 20, 20)"
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
  const drawFallbackWaveform = (canvas: HTMLCanvasElement, color: string) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "rgb(20, 20, 20)"
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
          <h3 className="text-sm font-medium mb-2">Native Speaker</h3>
          <AudioPlayer
            audioUrl={nativeAudioUrl}
            label="Native Speaker"
            fallbackText={fallbackText}
            language={language}
          />
          <canvas
            ref={nativeCanvasRef}
            width="300"
            height="100"
            className="w-full h-24 mt-2 rounded-md bg-background border"
          ></canvas>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Your Recording</h3>
          <AudioPlayer audioUrl={userAudioUrl} label="Your Recording" />
          <canvas
            ref={userCanvasRef}
            width="300"
            height="100"
            className="w-full h-24 mt-2 rounded-md bg-background border"
          ></canvas>
        </div>
      </div>

      {comparisonResult !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Pronunciation Accuracy</h3>
                <Badge className={getScoreColor(comparisonResult)}>{comparisonResult}%</Badge>
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

