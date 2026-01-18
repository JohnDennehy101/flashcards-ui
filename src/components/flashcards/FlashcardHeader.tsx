import { JSX } from "react"
import { Button } from "../../components/buttons/Button.tsx"
import ChevronDownIcon from "../../assets/images/icon-chevron-down.svg?react"
import ShuffleIcon from "../../assets/images/icon-shuffle.svg?react"

interface FlashcardHeaderProps {
  onCategoryClick?: () => void
  onShuffleClick?: () => void
  onHideMasteredChange?: (hidden: boolean) => void
  selectedCategory?: string
  hideMastered?: boolean
}

export function FlashcardHeader({
  onCategoryClick = () => {},
  onShuffleClick = () => {},
  onHideMasteredChange = () => {},
  selectedCategory = "All Categories",
  children,
  hideMastered = false,
}: FlashcardHeaderProps & { children?: React.ReactNode }): JSX.Element {
  return (
    <div className="bg-neutral0 lg:h-1/7 w-full border-b-1 border-neutral900">
      <div className="h-full w-full px-5 py-5 flex items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <div className="relative">
            <Button
              text={
                <span className="hidden md:inline">{selectedCategory}</span>
              }
              onClick={onCategoryClick}
              iconPosition={"end"}
              icon={<ChevronDownIcon />}
              className="cursor-pointer"
            />
            {children}
          </div>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-neutral900 text-yellow500 focus:ring-yellow500 cursor-pointer"
              checked={hideMastered}
              onChange={e => onHideMasteredChange(e.target.checked)}
            />
            <span className="text-preset4-semibold font-poppins text-neutral900">
              Hide Mastered
            </span>
          </label>
        </div>

        <div>
          <Button
            text={<span className="hidden md:inline">{"Shuffle"}</span>}
            onClick={onShuffleClick}
            iconPosition={"start"}
            icon={<ShuffleIcon />}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
