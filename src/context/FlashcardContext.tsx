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

export interface FilterOptions {
  categories: Category[]
  source_files: string[]
  sections: string[]
  question_types: string[]
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
  availableFiles: string[]
  availableSections: string[]
  availableTypes: string[]
  selectedFile: string
  setSelectedFile: (file: string) => void
  selectedSection: string
  setSelectedSection: (section: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
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
  const [availableFiles, setAvailableFiles] = useState<string[]>([])
  const [availableSections, setAvailableSections] = useState<string[]>([])
  const [availableTypes, setAvailableTypes] = useState<string[]>([])

  const [selectedFile, setSelectedFile] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const pageSizeRef = useRef(12)
  const isFetchingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  const shuffleCards = () => {
    setSort(prev => (prev === "random" ? "id" : "random"))
  }

  const loadData = useCallback(
    async (force = false, page = 1, customPageSize?: number) => {
      if (isFetchingRef.current) return
      if (customPageSize !== undefined) pageSizeRef.current = customPageSize
      if (!force && hasInitializedRef.current) {
        setIsLoading(false)
        return
      }

      try {
        isFetchingRef.current = true
        if (page === 1) setIsLoading(true)
        setError(null)

        const catNames = selectedCategories.map(c => c.name).join(",")

        const [res, statsData] = await Promise.all([
          apiService.getAll(
            page,
            pageSizeRef.current,
            catNames,
            hideMastered,
            sort,
            selectedFile,
            selectedSection,
            selectedType,
          ),
          apiService.getStats(),
        ])

        const { flashcards: newCards, metadata: newMeta, filter_options } = res

        setFlashcards(prev => (page === 1 ? newCards : [...prev, ...newCards]))
        setStats(statsData)
        setMetadata(newMeta)

        setCategories(filter_options.categories)
        setAvailableFiles(filter_options.source_files)
        setAvailableSections(filter_options.sections)
        setAvailableTypes(filter_options.question_types)

        hasInitializedRef.current = true
      } catch (err) {
        console.error(err)
        setError("Failed to sync data.")
      } finally {
        isFetchingRef.current = false
        setIsLoading(false)
      }
    },
    [
      selectedCategories,
      hideMastered,
      sort,
      selectedFile,
      selectedSection,
      selectedType,
    ],
  )

  useEffect(() => {
    loadData(true, 1)
  }, [
    selectedCategories,
    hideMastered,
    sort,
    selectedFile,
    selectedSection,
    selectedType,
    loadData,
  ])

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
        availableFiles,
        availableSections,
        availableTypes,
        selectedFile,
        setSelectedFile,
        selectedSection,
        setSelectedSection,
        selectedType,
        setSelectedType,
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
