"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  audioUrl: string | null
  label: string
  fallbackText?: string // Text to speak if audio fails
  language?: string // Language code for speech synthesis
}

export function AudioPlayer({ audioUrl, label, fallbackText, language = "en-US" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Set up speech synthesis for fallback
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis && fallbackText) {
      const utterance = new SpeechSynthesisUtterance(fallbackText)

      // Try to find a voice for the specified language
      const voices = window.speechSynthesis.getVoices()
      const voice = voices.find((v) => v.lang.startsWith(language.split("-")[0]))
      if (voice) {
        utterance.voice = voice
      }

      utterance.lang = language
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = volume

      speechSynthRef.current = utterance

      // Set up event listeners for the utterance
      utterance.onstart = () => {
        setIsPlaying(true)
        // Start a timer to simulate progress
        let elapsed = 0
        const estimatedDuration = fallbackText.length * 80 // Rough estimate: 80ms per character
        setDuration(estimatedDuration / 1000)

        timerRef.current = setInterval(() => {
          elapsed += 100
          setCurrentTime(elapsed / 1000)
          if (elapsed >= estimatedDuration) {
            if (timerRef.current) clearInterval(timerRef.current)
            setIsPlaying(false)
            setCurrentTime(0)
          }
        }, 100)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (timerRef.current) clearInterval(timerRef.current)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        if (timerRef.current) clearInterval(timerRef.current)
      }

      return () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel()
        }
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [fallbackText, language, volume])

  // Create and set up audio element when audioUrl changes
  useEffect(() => {
    setUseFallback(false)

    // Clean up previous audio element
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    if (!audioUrl) return

    setIsLoading(true)

    // Create new audio element
    const audio = new Audio()

    // Set up event listeners
    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      } else {
        setDuration(0)
      }
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = (e: Event) => {
      // Silently switch to fallback without showing errors
      setIsLoading(false)
      setUseFallback(true)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    // Set initial volume
    audio.volume = volume
    audio.muted = isMuted

    // Set the source and preload
    audio.crossOrigin = "anonymous" // Try to avoid CORS issues
    audio.src = audioUrl
    audio.preload = "metadata"

    audioRef.current = audio

    // Set a timeout to detect if audio is taking too long to load
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        setUseFallback(true)
      }
    }, 3000) // Reduced timeout for better UX

    // Clean up
    return () => {
      clearTimeout(timeoutId)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.pause()
    }
  }, [audioUrl])

  // Update audio when volume or muted state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
      audioRef.current.muted = isMuted
    }

    if (speechSynthRef.current) {
      speechSynthRef.current.volume = volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (useFallback && fallbackText) {
      // Use speech synthesis
      if (isPlaying) {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        if (timerRef.current) clearInterval(timerRef.current)
      } else {
        if (speechSynthRef.current) {
          window.speechSynthesis.speak(speechSynthRef.current)
        }
      }
    } else if (audioRef.current) {
      // Use audio element
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // If at the end, restart
        if (audioRef.current.currentTime >= audioRef.current.duration) {
          audioRef.current.currentTime = 0
        }

        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
          })
          .catch((err) => {
            // Silently switch to fallback
            setUseFallback(true)

            // Try to play with speech synthesis
            if (fallbackText && speechSynthRef.current) {
              window.speechSynthesis.speak(speechSynthRef.current)
            }
          })
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleTimeChange = (value: number[]) => {
    const newTime = value[0]
    setCurrentTime(newTime)

    if (audioRef.current && !useFallback) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!audioUrl && !fallbackText) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.01}
          onValueChange={handleTimeChange}
          aria-label="Seek time"
          disabled={isLoading || (useFallback && isPlaying)}
        />

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={isLoading || (!audioUrl && !fallbackText)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
              disabled={isLoading}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Slider
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="w-20"
              aria-label="Volume"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

