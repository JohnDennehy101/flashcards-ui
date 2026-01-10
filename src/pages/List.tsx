import {JSX, useState} from "react";
import {FlashcardForm} from "../components/forms/FlashcardForm"
import {Button} from "../components/buttons/Button.tsx";
import PlusIcon from "../assets/images/icon-circle-plus.svg?react"
import CrossIcon from "../assets/images/icon-cross.svg?react"
import ShuffleIcon from "../assets/images/icon-shuffle.svg?react"
import ChevronDownIcon from "../assets/images/icon-chevron-down.svg?react"
import {Card} from "../components/cards/Card.tsx";
import {useFlashcards} from "../context/FlashcardContext.tsx";

export function List(): JSX.Element {
    const [showAddCard, setShowAddCard] = useState(false);
    const { flashcards, isLoading, error } = useFlashcards();

    const getAnswerPreview = (card: any): string => {
        const content = card.flashcard_content;

        switch (card.flashcard_type) {
            case "qa":
                return content.answer || "";
            case "yes_no":
                return `Correct: ${content.correct ? 'Yes' : 'No'}. ${content.justification || ""}`;
            case "mcq":
                return content.options?.[content.correct_index] || "Multiple Choice";
            default:
                return "View details...";
        }
    };

    return (
        <div className="flex flex-col items-start bg-neutral-0 w-full min-h-screen lg:px-24 md:px-8 px-4 py-4 gap-6">
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                    <Button
                        onClick={() => setShowAddCard(!showAddCard)}
                        text={showAddCard ? "Close" : "Add"}
                        icon={showAddCard ? <CrossIcon/> : <PlusIcon />}
                        iconPosition={"start"}
                        className="bg-yellow500"
                    />
                    <Button onClick={() => {}} text={"All Categories"} icon={<ChevronDownIcon />} iconPosition={"end"} />
                </div>
                <Button onClick={() => {}}  text={"Shuffle"} icon={<ShuffleIcon />} iconPosition={"start"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
                {showAddCard && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3">
                        <FlashcardForm />
                    </div>
                )}

                {isLoading ? (
                    <p>Loading flashcards...</p>
                ) : (
                    flashcards.map((card: any) => (
                        <Card
                            key={card.id}
                            id={card.id.toString()}
                            question={card.question}
                            answer={getAnswerPreview(card)}
                            category={card.categories?.[0] || "General"}
                            progress={card.correct_count ?? 0}
                        />
                    ))
                )}
            </div>
        </div>
    );
}