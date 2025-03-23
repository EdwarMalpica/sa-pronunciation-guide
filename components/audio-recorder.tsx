"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string, duration: number) => void
  disabled?: boolean
}

export function AudioRecorder({ onRecordingComplete, disabled = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const recordingStartTimeRef = useRef<number>(0)

  const MAX_RECORDING_TIME = 10 // 10 seconds

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    setError(null)

    try {
      setIsProcessing(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      chunksRef.current = []
      recordingStartTimeRef.current = Date.now()

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Calculate actual recording duration
        const recordingDuration = (Date.now() - recordingStartTimeRef.current) / 1000

        // Round up if decimal part is 0.5 or greater
        const roundedDuration = recordingDuration % 1 >= 0.5 ? Math.ceil(recordingDuration) : recordingDuration

        // Create audio blob with proper duration metadata
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)

        onRecordingComplete(audioUrl, roundedDuration)

        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }

        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        setRecordingTime(0)
        setIsRecording(false)
        setIsProcessing(false)
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      setIsProcessing(false)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setError("Could not access microphone. Please check your browser permissions.")
      setIsProcessing(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      setIsProcessing(true)
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div>
      {/* Reduced spacing from space-y-4 to space-y-2 */}
      <div className="flex flex-col items-center space-y-2">
        {/* Reduced spacing from space-y-4 to space-y-2 */}
        <h3 className="text-sm font-medium">Record your pronunciation</h3>
        {error && (
          <Alert variant="destructive" className="mb-2">
            {/* Reduced margin from mb-4 to mb-2 */}
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="w-full flex items-center justify-center gap-4">
          {isRecording && (
            <>
              <Progress value={(recordingTime / MAX_RECORDING_TIME) * 100} className="w-full" />
              <span className="text-sm whitespace-nowrap">
                {recordingTime}s / {MAX_RECORDING_TIME}s
              </span>
            </>
          )}
        </div>
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isRecording ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

