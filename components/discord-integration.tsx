"use client"

import { useState } from "react"

interface DiscordUser {
  id: string
  username: string
  displayName: string
  avatar: string
}

export function useDiscordAPI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDiscordUser = async (userId: string): Promise<DiscordUser | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/discord?id=${userId}`)

      if (!response.ok) {
        throw new Error("Usuário não encontrado")
      }

      const userData = await response.json()
      return userData
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchDiscordUser, loading, error }
}
