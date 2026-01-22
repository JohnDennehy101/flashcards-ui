import { LoginFormValues } from "../schemas/login.ts"
import { FlashcardFormValues } from "@/schemas/flashcard.ts"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

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
  getAll: async (
    page = 1,
    pageSize = 12,
    categories = "",
    hideMastered = false,
    currentSort = "id",
  ) => {
    const query: Record<string, string> = {
      page: page.toString(),
      page_size: pageSize.toString(),
      sort: currentSort,
    }

    if (categories) query.categories = categories
    if (hideMastered) query.hide_mastered = "true"

    const params = new URLSearchParams(query)
    const response = await apiRequest(`/flashcards?${params.toString()}`)
    return response.json()
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

  async getCategories(hideMastered = false) {
    const response = await apiRequest(
      `/categories?hide_mastered=${hideMastered}`,
    )
    return await response.json()
  },

  async createFlashcard(flashcard: FlashcardFormValues) {
    const data = await apiRequest("/flashcards", {
      method: "POST",
      body: JSON.stringify(flashcard),
    })

    return data
  },

  async updateFlashcard(id: string | number, flashcard: FlashcardFormValues) {
    const data = await apiRequest(`/flashcards/${id}`, {
      method: "PUT",
      body: JSON.stringify(flashcard),
    })

    return data
  },

  async deleteFlashcard(id: string | number) {
    const data = await apiRequest(`/flashcards/${id}`, {
      method: "DELETE",
    })

    return data
  },
}
