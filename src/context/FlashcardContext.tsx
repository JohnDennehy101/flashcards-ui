import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
} from "react"
import { apiService } from "../services/api"

export interface Metadata {
  current_page: number
  page_size: number
  first_page: number
  last_page: number
  total_records: number
}

interface FlashcardStats {
  total: number
  mastered: number
  in_progress: number
  not_started: number
}

export interface Category {
  name: string
  count: number
}

interface FlashcardContextType {
  metadata: Metadata | null
  flashcards: any[]
  categories: Category[]
  stats: FlashcardStats | null
  isLoading: boolean
  error: string | null
  refreshData: (
    force?: boolean,
    page?: number,
    pageSize?: number,
  ) => Promise<void>
  selectedCategories: Category[]
  setSelectedCategories: Dispatch<SetStateAction<Category[]>>
  hideMastered: boolean
  setHideMastered: Dispatch<SetStateAction<boolean>>
  setFlashcards: Dispatch<SetStateAction<any[]>>
  shuffleCards: () => void
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined,
)

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<FlashcardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [hideMastered, setHideMastered] = useState(false)
  const [sort, setSort] = useState<string>("id")

  const pageSizeRef = useRef(12)
  const isFetchingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  const shuffleCards = () => {
    setSort(prev => (prev === "random" ? "id" : "random"))
  }

  const loadData = useCallback(
    async (force = false, page = 1, customPageSize?: number) => {
      if (isFetchingRef.current) return

      if (customPageSize !== undefined) {
        pageSizeRef.current = customPageSize
      }

      if (!force && hasInitializedRef.current) {
        setIsLoading(false)
        return
      }

      try {
        isFetchingRef.current = true
        if (page === 1) setIsLoading(true)
        setError(null)

        const catNames = selectedCategories.map(c => c.name).join(",")

        const [cardsData, statsData, categoriesData] = await Promise.all([
          apiService.getAll(
            page,
            pageSizeRef.current,
            catNames,
            hideMastered,
            sort,
          ),
          apiService.getStats(),
          apiService.getCategories(hideMastered),
        ])

        setFlashcards(prev => {
          return page === 1
            ? cardsData.flashcards
            : [...prev, ...cardsData.flashcards]
        })

        setStats(statsData)
        setCategories(categoriesData.categories)
        setMetadata(cardsData.metadata)

        hasInitializedRef.current = true
      } catch (err) {
        console.error(err)
        setError("Failed to sync data.")
      } finally {
        isFetchingRef.current = false
        setIsLoading(false)
      }
    },
    [selectedCategories, hideMastered, sort],
  )

  useEffect(() => {
    loadData(true, 1)
  }, [selectedCategories, hideMastered, sort, loadData])

  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        setFlashcards,
        metadata,
        categories,
        stats,
        isLoading,
        error,
        refreshData: loadData,
        selectedCategories,
        setSelectedCategories,
        hideMastered,
        setHideMastered,
        shuffleCards,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  )
}

export const useFlashcards = () => {
  const context = useContext(FlashcardContext)
  if (context === undefined) {
    throw new Error("useFlashcards must be used within a FlashcardProvider")
  }
  return context
}
