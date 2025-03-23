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
  initialDuration?: number // Initial duration in seconds
}

export function AudioPlayer({ audioUrl, label, fallbackText, language = "en-US", initialDuration }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(initialDuration || 0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const durationCheckTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize with the provided duration if available
  useEffect(() => {
    if (initialDuration && initialDuration > 0) {
      // Round up if decimal part is 0.5 or greater
      const roundedDuration = initialDuration % 1 >= 0.5 ? Math.ceil(initialDuration) : initialDuration
      setDuration(roundedDuration)
    }
  }, [initialDuration])

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
        // Estimate duration based on text length (at least 1 second)
        const estimatedDuration = Math.max(1, (fallbackText.length * 80) / 1000) // At least 1 second
        if (!duration || duration <= 0) {
          setDuration(estimatedDuration)
        }

        // Start a timer to update progress
        let elapsed = 0
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current)
        }

        progressTimerRef.current = setInterval(() => {
          elapsed += 0.1
          setCurrentTime(Math.min(elapsed, duration || estimatedDuration))
          if (elapsed >= (duration || estimatedDuration)) {
            if (progressTimerRef.current) clearInterval(progressTimerRef.current)
            setIsPlaying(false)
            setCurrentTime(0)
          }
        }, 100)
      }

      utterance.onend = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      }

      return () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel()
        }
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
      }
    }
  }, [fallbackText, language, volume, duration])

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration !== Number.POSITIVE_INFINITY) {
        // Only update duration if we don't already have a valid one or if the new duration is more accurate
        if (!initialDuration || initialDuration <= 0 || (audio.duration > 1 && initialDuration <= 1)) {
          // Round up if decimal part is 0.5 or greater
          const roundedDuration = audio.duration % 1 >= 0.5 ? Math.ceil(audio.duration) : audio.duration
          setDuration(roundedDuration)
        }
      } else if (!initialDuration || initialDuration <= 0) {
        // Set a minimum duration of 1 second if actual duration can't be determined
        setDuration(1)

        // Start a timer to periodically check for duration updates
        if (durationCheckTimerRef.current) {
          clearInterval(durationCheckTimerRef.current)
        }

        durationCheckTimerRef.current = setInterval(() => {
          if (
            audio.duration &&
            !isNaN(audio.duration) &&
            audio.duration !== Number.POSITIVE_INFINITY &&
            audio.duration > 1
          ) {
            // Round up if decimal part is 0.5 or greater
            const roundedDuration = audio.duration % 1 >= 0.5 ? Math.ceil(audio.duration) : audio.duration
            setDuration(roundedDuration)
            if (durationCheckTimerRef.current) {
              clearInterval(durationCheckTimerRef.current)
            }
          }
        }, 500)
      }
      setIsLoading(false)
    }

    const handleDurationChange = () => {
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        audio.duration !== Number.POSITIVE_INFINITY &&
        audio.duration > 0
      ) {
        // Round up if decimal part is 0.5 or greater
        const roundedDuration = audio.duration % 1 >= 0.5 ? Math.ceil(audio.duration) : audio.duration
        setDuration(roundedDuration)
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)

      // Update duration if it becomes available during playback
      if (
        audio.duration &&
        !isNaN(audio.duration) &&
        audio.duration !== Number.POSITIVE_INFINITY &&
        audio.duration > 1
      ) {
        // Round up if decimal part is 0.5 or greater
        const roundedDuration = audio.duration % 1 >= 0.5 ? Math.ceil(audio.duration) : audio.duration
        setDuration(roundedDuration)
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      // Silently switch to fallback without showing errors
      setIsLoading(false)
      setUseFallback(true)

      // Only set a fallback duration if we don't already have one
      if (!initialDuration || initialDuration <= 0) {
        // Set a minimum duration for fallback
        setDuration(Math.max(1, fallbackText ? fallbackText.length * 0.08 : 1))
      }
    }

    // Set up event listeners
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("durationchange", handleDurationChange)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    // For blob URLs, try to get duration using a different approach
    if (audioUrl && audioUrl.startsWith("blob:")) {
      const getBlobDuration = async () => {
        try {
          const response = await fetch(audioUrl)
          const blob = await response.blob()

          // Use AudioContext to decode the audio and get its duration
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          const arrayBuffer = await blob.arrayBuffer()

          audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            if (audioBuffer.duration && audioBuffer.duration > 0) {
              setDuration(audioBuffer.duration)
            }
          })
        } catch (err) {
          // Silently handle errors
        }
      }

      getBlobDuration()
    }

    // Set a timeout to detect if audio is taking too long to load
    const timeoutId = setTimeout(() => {
      if (isLoading && audioUrl) {
        setIsLoading(false)
        setUseFallback(true)

        // Only set a fallback duration if we don't already have one
        if (!initialDuration || initialDuration <= 0) {
          // Set a minimum duration for fallback
          setDuration(Math.max(1, fallbackText ? fallbackText.length * 0.08 : 1))
        }
      }
    }, 3000) // Reduced timeout for better UX

    // Clean up
    return () => {
      clearTimeout(timeoutId)
      if (durationCheckTimerRef.current) {
        clearInterval(durationCheckTimerRef.current)
      }
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("durationchange", handleDurationChange)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [audioUrl, fallbackText, initialDuration, isLoading])

  // Update audio source when audioUrl changes
  useEffect(() => {
    if (!audioRef.current) return

    setUseFallback(false)
    setIsLoading(!!audioUrl)

    if (audioUrl) {
      audioRef.current.src = audioUrl
      audioRef.current.load()
    } else {
      audioRef.current.removeAttribute("src")
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
        if (progressTimerRef.current) clearInterval(progressTimerRef.current)
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

            // Double-check duration during playback
            if (
              audioRef.current &&
              audioRef.current.duration &&
              !isNaN(audioRef.current.duration) &&
              audioRef.current.duration !== Number.POSITIVE_INFINITY &&
              audioRef.current.duration > 1
            ) {
              setDuration(audioRef.current.duration)
            }
          })
          .catch(() => {
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

  // Update the formatTime function in the AudioPlayer component
  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00"

    // Round up if decimal part is 0.5 or greater
    const roundedTime = time % 1 >= 0.5 ? Math.ceil(time) : Math.floor(time)

    const minutes = Math.floor(roundedTime / 60)
    const seconds = Math.floor(roundedTime % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!audioUrl && !fallbackText) return null

  return (
    <div className="space-y-4">
      {" "}
      {/* Increased spacing from space-y-2 to space-y-4 */}
      {/* Hidden native audio element */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" className="hidden" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div className="space-y-4">
        {" "}
        {/* Increased spacing from space-y-2 to space-y-4 */}
        <Slider
          value={[currentTime]}
          max={duration || 1}
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

