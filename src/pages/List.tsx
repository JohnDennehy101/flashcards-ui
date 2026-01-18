import { JSX, useEffect, useMemo, useState } from "react"
import { FlashcardForm } from "../components/forms/FlashcardForm"
import { Button } from "../components/buttons/Button.tsx"
import PlusIcon from "../assets/images/icon-circle-plus.svg?react"
import CrossIcon from "../assets/images/icon-cross.svg?react"
import ShuffleIcon from "../assets/images/icon-shuffle.svg?react"
import ChevronDownIcon from "../assets/images/icon-chevron-down.svg?react"
import { Card } from "../components/cards/Card.tsx"
import { Category, useFlashcards } from "../context/FlashcardContext.tsx"
import { CategoryDropdown } from "../components/dropdowns/CategoryDropdown.tsx"
import { Modal } from "../components/modals/Modal.tsx"
import { apiService } from "../services/api.ts"
import { useSnackbar } from "../context/SnackbarContext.tsx"

type ActiveAction =
  | { type: "add" }
  | { type: "edit"; card: any }
  | { type: "delete"; cardId: string }
  | null

export function List(): JSX.Element {
  const [activeAction, setActiveAction] = useState<ActiveAction>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const { showSnackbar } = useSnackbar()

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as HTMLElement

      if (openMenuId && !target.closest("[data-menu-container]")) {
        setOpenMenuId(null)
      }
    }

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickAway)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickAway)
    }
  }, [openMenuId])

  const {
    flashcards,
    isLoading,
    categories,
    selectedCategories,
    setSelectedCategories,
    hideMastered,
    setHideMastered,
    shuffleCards,
    refreshData,
  } = useFlashcards()

  const handleCloseAction = () => setActiveAction(null)

  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev: Category[]) => {
      const isAlreadySelected = prev.some(
        (c: Category) => c.name === categoryName,
      )
      if (isAlreadySelected) {
        return prev.filter((c: Category) => c.name !== categoryName)
      } else {
        const categoryObject = categories.find(
          (c: Category) => c.name === categoryName,
        )
        return categoryObject ? [...prev, categoryObject] : prev
      }
    })
  }

  const handleDelete = async () => {
    if (activeAction?.type !== "delete") return

    try {
      const response = await apiService.deleteFlashcard(activeAction.cardId)

      if (response.ok) {
        await refreshData(true)
        showSnackbar("Card deleted.")
        setActiveAction(null)
      } else {
        const errorData = await response.json()
        console.error("Failed to delete:", errorData)
        alert("Could not delete card. Please try again.")
      }
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const filteredFlashcards = useMemo(() => {
    return flashcards.filter(card => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        card.categories?.some((cardCat: string) =>
          selectedCategories.some((sel: any) => sel.name === cardCat),
        )
      const matchesMastery = !hideMastered || card.status !== "mastered"
      return matchesCategory && matchesMastery
    })
  }, [flashcards, selectedCategories, hideMastered])

  const getAnswerPreview = (card: any): string => {
    const content = card.flashcard_content
    switch (card.flashcard_type) {
      case "qa":
        return content.answer || ""
      case "yes_no":
        return `Correct: ${content.correct ? "Yes" : "No"}. ${content.justification || ""}`
      case "mcq":
        return content.options?.[content.correct_index] || "Multiple Choice"
      default:
        return "View details..."
    }
  }

  return (
    <div className="flex flex-col items-start bg-neutral-0 w-full min-h-screen lg:px-24 md:px-8 px-4 py-3 gap-6">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3 items-center">
          <div className="relative p-2.5 py-4 flex items-center">
            <Button
              onClick={() => setShowCategories(!showCategories)}
              text={
                <span className="hidden md:inline">
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} Selected`
                    : "All Categories"}
                </span>
              }
              icon={<ChevronDownIcon />}
              iconPosition={"end"}
            />
            {showCategories && (
              <CategoryDropdown
                categories={categories}
                selectedCategories={selectedCategories}
                onToggle={categoryName => toggleCategory(categoryName)}
                onClear={() => setSelectedCategories([])}
              />
            )}
          </div>

          <Button
            onClick={() =>
              setActiveAction(
                activeAction?.type === "add" ? null : { type: "add" },
              )
            }
            text={
              <span className="hidden md:inline">
                {activeAction?.type === "add" ? "Close" : "Add"}
              </span>
            }
            icon={activeAction?.type === "add" ? <CrossIcon /> : <PlusIcon />}
            iconPosition={"start"}
            className="bg-yellow500"
          />

          <label className="flex items-center gap-2 ml-4 cursor-pointer group whitespace-nowrap">
            <input
              type="checkbox"
              checked={hideMastered}
              onChange={e => setHideMastered(e.target.checked)}
              className="w-4 h-4 rounded border-neutral900 text-yellow500 focus:ring-yellow500 cursor-pointer"
            />
            <span className="text-sm font-medium text-neutral900 group-hover:text-neutral700 transition-colors">
              Hide Mastered
            </span>
          </label>
        </div>

        <Button
          onClick={shuffleCards}
          text={<span className="hidden md:inline">Shuffle</span>}
          icon={<ShuffleIcon />}
          iconPosition={"start"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
        {activeAction?.type === "add" && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <FlashcardForm
              refresh={refreshData}
              key="add"
              onCancel={handleCloseAction}
              onSuccess={handleCloseAction}
            />
          </div>
        )}

        {isLoading ? (
          <p>Loading flashcards...</p>
        ) : (
          filteredFlashcards.map((card: any) => (
            <Card
              key={card.id}
              id={card.id.toString()}
              question={card.question}
              answer={getAnswerPreview(card)}
              categories={card.categories}
              selectedCategories={selectedCategories}
              progress={card.correct_count ?? 0}
              target={5}
              isMenuOpen={openMenuId === card.id.toString()}
              onMenuToggle={(isOpen: boolean) =>
                setOpenMenuId(isOpen ? card.id.toString() : null)
              }
              onEdit={() => {
                setActiveAction({ type: "edit", card })
                setOpenMenuId(null)
              }}
              onDelete={() => {
                setActiveAction({ type: "delete", cardId: card.id })
                setOpenMenuId(null)
              }}
            />
          ))
        )}
      </div>

      <Modal
        isOpen={activeAction?.type === "edit"}
        onClose={() => setActiveAction(null)}
        title="Edit your card"
        size="4xl"
      >
        {activeAction?.type === "edit" && (
          <FlashcardForm
            refresh={refreshData}
            initialData={activeAction.card}
            onSuccess={() => setActiveAction(null)}
            key={activeAction.card.id}
          />
        )}
      </Modal>

      <Modal
        isOpen={activeAction?.type === "delete"}
        onClose={() => setActiveAction(null)}
        title="Delete this card?"
        type="delete"
      >
        <div>
          <p>This action can't be undone.</p>
          <div className="flex justify-end items-center h-full gap-2 border-t py-3 mt-5">
            <Button text="Cancel" onClick={() => setActiveAction(null)} />
            <Button
              text="Delete Card"
              className="bg-yellow500 cursor-pointer border-neutral900 border-1 rounded-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none transition-all disabled:opacity-50"
              onClick={handleDelete}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
