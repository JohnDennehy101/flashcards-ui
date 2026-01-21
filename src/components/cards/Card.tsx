import { JSX, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ProgressBar } from "../../components/progress/ProgressBar.tsx"
import { CardMenu } from "../../components/menus/CardMenu.tsx"
import { Button } from "../../components/buttons/Button.tsx"
import MasteredIcon from "../../assets/images/icon-mastered.svg?react"
import { Category } from "@/context/FlashcardContext.tsx"
import {formatOcrText} from "../../utils/text.ts";

interface CardProps {
  id: string
  question: string
  answer: string
  categories: string[]
  selectedCategories: Category[]
  progress: number
  target: number
  isMenuOpen: boolean
  onMenuToggle: (isOpen: boolean) => void
  onEdit: () => void
  onDelete: () => void
}

export function Card({
  id,
  question,
  answer,
  categories,
  selectedCategories,
  progress,
  target,
  isMenuOpen,
  onMenuToggle,
  onEdit,
  onDelete,
}: CardProps): JSX.Element {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/study/${id}`)
  }

  const { visible, remaining } = useMemo(() => {
    if (!categories?.length) return { visible: [], remaining: 0 }

    const matched = categories.filter(catName =>
      selectedCategories.some(sel => sel.name === catName),
    )

    const others = categories.filter(
      catName => !selectedCategories.some(sel => sel.name === catName),
    )

    const combined = [...matched, ...others]

    const CHAR_LIMIT = 20
    let currentLength = 0
    const visibleTags: string[] = []

    for (const cat of combined) {
      if (currentLength + cat.length > CHAR_LIMIT && visibleTags.length > 0)
        break
      visibleTags.push(cat)
      currentLength += cat.length
    }

    return {
      visible: visibleTags,
      remaining: combined.length - visibleTags.length,
    }
  }, [categories, selectedCategories])

  return (
    <div
      className="flex border rounded-8 bg-neutral0 flex-col justify-between w-full h-full cursor-pointer hover:border-neutral900"
      onClick={handleCardClick}
      data-menu-container="true"
    >
      <div className="overflow-hidden">
        <h2 className="text-preset3 p-4">{question}</h2>
      </div>
      <div className="p-4 flex flex-col gap-4 border-t flex-1">
        <h3 className="text-preset5 text-neutral-900">Answer:</h3>
        <p className="text-preset5">{formatOcrText(answer)}</p>
      </div>
      <div className="flex justify-between gap-4 border-t">
        <div className="flex items-center p-2.5 gap-1.5 border-r border-neutral900 bg-neutral50/50">
          {visible.length > 0 ? (
            <>
              {visible.map((cat, index) => (
                <span
                  key={index}
                  className="text-[10px] font-bold uppercase tracking-wider text-neutral900 py-1 px-2 border border-neutral900 rounded-full bg-neutral0 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {cat}
                </span>
              ))}

              {remaining > 0 && (
                <div className="group relative flex items-center">
                  <span className="text-[10px] font-bold text-neutral500 bg-neutral200 px-1.5 py-1 rounded-full cursor-help">
                    +{remaining}
                  </span>

                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col gap-1 bg-neutral900 text-neutral0 p-2 border border-neutral900 z-50 min-w-[120px]">
                    {categories.slice(visible.length).map((cat, i) => (
                      <span key={i} className="text-[10px] whitespace-nowrap">
                        • {cat}
                      </span>
                    ))}
                    <div className="absolute top-full left-3 border-8 border-transparent border-t-neutral900" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <span className="text-[10px] font-bold uppercase text-neutral400 italic">
              Uncategorised
            </span>
          )}
        </div>

        <div className="flex flex-1 items-center justify-start min-w-0">
          <div className="w-fit max-w-full">
            {progress < target ? (
              <div className="w-20">
                <ProgressBar current={progress} total={target} />
              </div>
            ) : (
              <Button
                onClick={() => {}}
                text={`Mastered ${progress}/${target}`}
                className="whitespace-nowrap !px-2 !py-1.5 bg-teal400 text-preset6 font-poppins hover:translate-y-0 hover:shadow-none cursor-default"
                iconPosition={"start"}
                icon={<MasteredIcon />}
              />
            )}
          </div>
        </div>

        <div className="flex items-center" onClick={e => e.stopPropagation()}>
          <CardMenu
            onEdit={onEdit}
            onDelete={onDelete}
            isOpen={isMenuOpen}
            onToggle={onMenuToggle}
          />
        </div>
      </div>
    </div>
  )
}
