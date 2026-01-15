import { LoginFormValues } from "../schemas/login.ts"
import { FlashcardFormValues } from "@/schemas/flashcard.ts"

const BASE_URL = "http://localhost:4000/v1"

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  headers.set("Content-Type", "application/json")

  const token = localStorage.getItem("auth_token")
  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))

    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      window.location.href = "/login"
    }

    throw new Error(
      errorData.error || `Request failed with status ${response.status}`,
    )
  }

  return response
}

export const apiService = {
  async login(credentials: LoginFormValues) {
    const res = await apiRequest("/tokens/authentication", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    const data = await res.json()

    if (data.authentication_token?.token) {
      localStorage.setItem("auth_token", data.authentication_token.token)
    }

    return data
  },
  async getAll(params?: { section?: string; categories?: string[] }) {
    const query = new URLSearchParams()
    if (params?.section) query.append("section", params.section)
    if (params?.categories)
      query.append("categories", params.categories.join(","))

    const res = await apiRequest(`/flashcards?${query.toString()}`)
    return await res.json() // returns { flashcards: [], metadata: {} }
  },
  async getById(id: string | number) {
    const res = await apiRequest(`/flashcards/${id}`)
    const data = await res.json()
    return data.flashcard
  },
  async getStats() {
    const res = await apiRequest(`/stats/flashcards`)
    const data = await res.json()
    return data.stats
  },
  async review(id: string | number) {
    const res = await apiRequest(`/flashcards/${id}/review`, {
      method: "POST",
    })
    return await res.json()
  },

  async reset(id: string | number) {
    const res = await apiRequest(`/flashcards/${id}/reset`, {
      method: "POST",
    })
    return await res.json()
  },

  async getCategories() {
    const response = await apiRequest(`/categories`)
    return await response.json()
  },

  async createFlashcard(flashcard: FlashcardFormValues) {
    const data = await apiRequest("/flashcards", {
      method: "POST",
      body: JSON.stringify(flashcard),
    })

    return data
  },
}
