import { JSX, useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Category, useFlashcards } from "../context/FlashcardContext"
import StatsTotalIcon from "../assets/images/icon-stats-total.svg?react"
import StatsInProgressIcon from "../assets/images/icon-stats-in-progress.svg?react"
import StatsMasteredIcon from "../assets/images/icon-stats-mastered.svg?react"
import StatsNotStartedIcon from "../assets/images/icon-stats-not-started.svg?react"
import { StatsItem } from "../components/stats/StatsItem.tsx"
import { FlashcardDisplay } from "../components/flashcards/FlashcardDisplay.tsx"
import { FlashcardHeader } from "../components/flashcards/FlashcardHeader.tsx"
import { FlashcardFooter } from "../components/flashcards/FlashcardFooter.tsx"
import { apiService } from "../services/api.ts"
import { CategoryDropdown } from "../components/dropdowns/CategoryDropdown.tsx"
import { Button } from "../components/buttons/Button.tsx"
import { useSnackbar } from "../context/SnackbarContext.tsx"
import { Modal } from "../components/modals/Modal.tsx"

export function Study(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { showSnackbar } = useSnackbar()

  const {
    flashcards,
    metadata,
    stats,
    isLoading: contextLoading,
    refreshData,
    categories,
    selectedCategories,
    setSelectedCategories,
    hideMastered,
    setHideMastered,
    shuffleCards,
  } = useFlashcards()

  const [showAnswer, setShowAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchedCard, setFetchedCard] = useState<any>(null)
  const [isLocalLoading, setIsLocalLoading] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  useEffect(() => {
    refreshData(true, 1, 1000)

    return () => {
      refreshData(false, 1, 12)
    }
  }, [])

  const card = useMemo(() => {
    const contextCard = flashcards.find(f => f.id === Number(id))
    if (contextCard) return contextCard

    if (flashcards.length === 0) return fetchedCard

    return null
  }, [flashcards, id, fetchedCard, flashcards.length])

  useEffect(() => {
    setShowAnswer(false)
    setFetchedCard(null)
    setError(null)
  }, [id])

  useEffect(() => {
    if (id && !contextLoading && flashcards.length > 0) {
      const isCurrentCardInFilteredList = flashcards.some(
        f => f.id === Number(id),
      )

      if (!isCurrentCardInFilteredList) {
        navigate(`/study/${flashcards[0].id}`, { replace: true })
      }
    }
  }, [id, flashcards, contextLoading, navigate])

  useEffect(() => {
    if (!contextLoading && flashcards.length > 0) {
      const isCurrentCardInFilteredList = flashcards.some(
        f => f.id === Number(id),
      )

      if (!isCurrentCardInFilteredList) {
        navigate(`/study/${flashcards[0].id}`, { replace: true })
      }
    }
  }, [id, flashcards, contextLoading, navigate])

  useEffect(() => {
    const noMatchesPossible = metadata && metadata.total_records === 0

    if (
      !contextLoading &&
      !card &&
      id &&
      flashcards.length === 0 &&
      !noMatchesPossible
    ) {
      const fetchIndividualCard = async () => {
        setIsLocalLoading(true)
        try {
          const response = await apiService.getById(id)
          if (response.ok) {
            const data = await response.json()
            setFetchedCard(data)
          } else {
            console.warn("Card not found in current filter context")
          }
        } catch (err) {
          setError("Failed to load the card.")
        } finally {
          setIsLocalLoading(false)
        }
      }
      fetchIndividualCard()
    }
  }, [id, card, contextLoading, flashcards.length, metadata])

  const handleNavigation = (direction: "next" | "prev") => {
    if (!flashcards.length) return

    const currentIndex = flashcards.findIndex(f => f.id === Number(id))

    if (currentIndex === -1) {
      navigate(`/study/${flashcards[0].id}`)
      return
    }

    let nextIndex
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % flashcards.length
    } else {
      nextIndex = (currentIndex - 1 + flashcards.length) % flashcards.length
    }

    navigate(`/study/${flashcards[nextIndex].id}`)
  }

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev: Category[]) => {
      const isAlreadySelected = prev.some(c => c.name === categoryName)
      if (isAlreadySelected) {
        return prev.filter(c => c.name !== categoryName)
      } else {
        const categoryObject = categories.find(c => c.name === categoryName)
        return categoryObject ? [...prev, categoryObject] : prev
      }
    })
  }

  const handleReview = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await apiService.review(id!)
      await refreshData(true)
      handleNavigation("next")
    } catch (err) {
      console.error(err)
    }
  }

  const handleResetClick = (e: MouseEvent) => {
    e.stopPropagation()
    setIsResetModalOpen(true)
  }

  const confirmReset = async () => {
    try {
      await apiService.reset(id!)
      await refreshData(true)

      showSnackbar("Progress reset successfully!")
    } catch (err) {
      showSnackbar("Failed to reset progress.")
    } finally {
      setIsResetModalOpen(false)
    }
  }

  if (contextLoading && flashcards.length === 0)
    return <div className="p-10 font-poppins">Loading session...</div>

  if (!contextLoading && flashcards.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[631px] w-full lg:px-24 md:px-8 px-4 py-4">
        <div className="flex flex-col items-center justify-center h-full w-full border-1 border-neutral900 rounded-20 bg-neutral0 shadow-sm">
          <p className="text-preset3 text-neutral600 text-center px-6">
            No cards match your filters in this category.
          </p>
          <Button
            text="Reset Filters"
            onClick={() => {
              setHideMastered(false)
              setSelectedCategories([])
            }}
            className="mt-4 bg-yellow500 hover:bg-yellow-600 transition-colors"
          />
        </div>
      </div>
    )
  }

  if (error)
    return <div className="p-10 text-red-500 font-poppins">Error: {error}</div>

  if (isLocalLoading)
    return <div className="p-10 font-poppins">Finding card...</div>

  if (card) {
    const currentIndex = flashcards.findIndex(f => f.id === Number(id))

    const currentPos = currentIndex !== -1 ? currentIndex + 1 : 1

    const totalCardsCount = metadata?.total_records ?? 0

    return (
      <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[631px] w-full lg:px-24 md:px-8 px-4 py-4">
        <div className="bg-neutral0 lg:w-2/3 h-fit lg:h-full flex items-center justify-between flex-col w-full border-1 border-neutral900 rounded-20 overflow-hidden">
          <FlashcardHeader
            selectedCategory={
              selectedCategories.length > 0
                ? `${selectedCategories.length} Selected`
                : "All Categories"
            }
            hideMastered={hideMastered}
            onCategoryClick={() => setShowCategories(!showCategories)}
            onShuffleClick={() => {
              shuffleCards()
              if (flashcards.length > 0) {
                navigate(`/study/${flashcards[0].id}`)
              }
            }}
            onHideMasteredChange={(checked: boolean) =>
              setHideMastered(checked)
            }
          >
            {showCategories && (
              <div className="absolute top-full left-0 z-50 mt-2">
                <CategoryDropdown
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onToggle={toggleCategory}
                  onClear={() => setSelectedCategories([])}
                />
              </div>
            )}
          </FlashcardHeader>

          <FlashcardDisplay
            currentStep={card.correct_count ?? 0}
            totalSteps={5}
            categories={card.categories || []}
            selectedCategories={selectedCategories}
            type={card.flashcard_type}
            content={{ ...card.flashcard_content, text: card.text }}
            question={card.question}
            showAnswer={showAnswer}
            onToggle={() => setShowAnswer(!showAnswer)}
            onReview={handleReview}
            onReset={handleResetClick}
          />

          <FlashcardFooter
            currentCard={currentPos}
            totalCards={totalCardsCount}
            onPrevious={() => handleNavigation("prev")}
            onNext={() => handleNavigation("next")}
          />
        </div>

        <div className="bg-neutral0 lg:w-1/3 w-full h-fit lg:h-full lg:items-stretch px-6 py-5 rounded-16 border-1 border-neutral900 overflow-hidden flex-col gap-4">
          <h2 className="text-preset2 font-poppins text-neutral-900 mb-4">
            Study Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 flex-1 lg:flex lg:flex-col lg:justify-between">
            <StatsItem
              label="Total Cards"
              value={stats?.total ?? 0}
              icon={<StatsTotalIcon />}
              iconBgColor="bg-blue400"
            />
            <StatsItem
              label="Mastered"
              value={stats?.mastered ?? 0}
              icon={<StatsMasteredIcon />}
              iconBgColor="bg-teal400"
            />
            <StatsItem
              label="In Progress"
              value={stats?.in_progress ?? 0}
              icon={<StatsInProgressIcon />}
              iconBgColor="bg-pink500"
            />
            <StatsItem
              label="Not Started"
              value={stats?.not_started ?? 0}
              icon={<StatsNotStartedIcon />}
              iconBgColor="bg-pink400"
            />
          </div>
        </div>

        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Reset Progress"
          type="delete"
          size="md"
        >
          <div className="flex flex-col gap-6 pb-6">
            <p className="text-preset3 text-neutral600">
              Are you sure you want to reset your progress for this card? This
              will return it to the "Not Started" state.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                text="Cancel"
                onClick={() => setIsResetModalOpen(false)}
                className="bg-neutral100 text-neutral900"
              />
              <Button
                text="Reset Progress"
                onClick={confirmReset}
                className="bg-yellow500 cursor-pointer border-neutral900 border-1 rounded-12 text-preset3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  return <div className="p-10 font-poppins">Finding card...</div>
}
