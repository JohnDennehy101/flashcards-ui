import { JSX } from "react"
import { Button } from "../../components/buttons/Button.tsx"
import ChevronLeftIcon from "../../assets/images/icon-chevron-left.svg?react"
import ChevronRightIcon from "../../assets/images/icon-chevron-right.svg?react"

interface FlashcardFooterProps {
  currentCard: number
  totalCards: number
  onPrevious: () => void
  onNext: () => void
}

export function FlashcardFooter({
  currentCard,
  totalCards,
  onPrevious,
  onNext,
}: FlashcardFooterProps): JSX.Element {
  return (
    <div className="bg-neutral0 h-[83px] lg:h-1/7 w-full">
      <div className="flex items-center justify-between h-full border-t-1 px-5 border-neutral900">
        <Button
          text={<span className="hidden md:block">Previous</span>}
          onClick={onPrevious}
          iconPosition={"start"}
          icon={<ChevronLeftIcon />}
          className="w-10 h-10 sm:overflow-hidden md:w-auto md:h-auto md:overflow-visible cursor-pointer"
        />

        <p className="text-preset5 text-neutral600 font-poppins">
          Card {currentCard} of {totalCards}
        </p>

        <Button
          text={<span className="hidden md:block">Next</span>}
          onClick={onNext}
          iconPosition={"end"}
          icon={<ChevronRightIcon />}
          className="w-10 h-10 sm:overflow-hidden md:w-auto md:h-auto md:overflow-visible cursor-pointer"
        />
      </div>
    </div>
  )
}
