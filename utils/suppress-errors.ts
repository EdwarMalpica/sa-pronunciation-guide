// This utility helps suppress console errors for specific elements
export function suppressAudioErrors() {
  if (typeof window !== "undefined") {
    // Store the original console.error
    const originalConsoleError = console.error

    // Override console.error to filter out audio-related errors
    console.error = (...args) => {
      // Check if this is an audio element error
      const errorString = args.join(" ")
      if (
        errorString.includes("The element has no supported sources") ||
        errorString.includes("Error playing audio:") ||
        errorString.includes("Audio error:")
      ) {
        // Suppress these specific errors
        return
      }

      // Pass through all other errors to the original console.error
      originalConsoleError.apply(console, args)
    }
  }
}

