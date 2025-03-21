"use client"

import { useEffect } from "react"
import { suppressAudioErrors } from "@/utils/suppress-errors"

export function ErrorSuppressor() {
  useEffect(() => {
    suppressAudioErrors()
  }, [])

  return null
}

