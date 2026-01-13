import {JSX, useMemo, useState} from "react";
import {FlashcardForm} from "../components/forms/FlashcardForm"
import {Button} from "../components/buttons/Button.tsx";
import PlusIcon from "../assets/images/icon-circle-plus.svg?react"
import CrossIcon from "../assets/images/icon-cross.svg?react"
import ShuffleIcon from "../assets/images/icon-shuffle.svg?react"
import ChevronDownIcon from "../assets/images/icon-chevron-down.svg?react"
import {Card} from "../components/cards/Card.tsx";
import {Category, useFlashcards} from "../context/FlashcardContext.tsx";
import {CategoryDropdown} from "../components/dropdowns/CategoryDropdown.tsx";

export function List(): JSX.Element {
    const [showAddCard, setShowAddCard] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const {
        flashcards,
        isLoading,
        categories,
        selectedCategories,
        setSelectedCategories,
        hideMastered,
        setHideMastered
    } = useFlashcards();

    const toggleCategory = (categoryName: string) => {
        setSelectedCategories((prev: Category[]) => {
            const isAlreadySelected = prev.some((c: Category) => c.name === categoryName);

            if (isAlreadySelected) {
                return prev.filter((c: Category) => c.name !== categoryName);
            } else {
                const categoryObject = categories.find((c: Category) => c.name === categoryName);

                return categoryObject ? [...prev, categoryObject] : prev;
            }
        });
    };

    const filteredFlashcards = useMemo(() => {
        return flashcards.filter(card => {
            const matchesCategory = selectedCategories.length === 0 ||
                card.categories?.some((cardCat: string) =>
                    selectedCategories.some((sel: any) => sel.name === cardCat)
                );

            const matchesMastery = !hideMastered || card.status !== "mastered";

            return matchesCategory && matchesMastery;
        });
    }, [flashcards, selectedCategories, hideMastered]);

    const getAnswerPreview = (card: any): string => {
        const content = card.flashcard_content;
        switch (card.flashcard_type) {
            case "qa": return content.answer || "";
            case "yes_no": return `Correct: ${content.correct ? 'Yes' : 'No'}. ${content.justification || ""}`;
            case "mcq": return content.options?.[content.correct_index] || "Multiple Choice";
            default: return "View details...";
        }
    };

    return (
        <div className="flex flex-col items-start bg-neutral-0 w-full min-h-screen lg:px-24 md:px-8 px-4 py-3 gap-6">
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-3 items-center">
                    <div className="relative p-2.5 py-4 flex items-center">
                        <Button
                            onClick={() => setShowCategories(!showCategories)}
                            text={
                                <span className="hidden md:inline">
                                    {selectedCategories.length > 0 ? `${selectedCategories.length} Selected` : "All Categories"} </span>}
                            icon={<ChevronDownIcon />}
                            iconPosition={"end"}
                        />

                        {showCategories && (
                            <CategoryDropdown categories={categories} selectedCategories={selectedCategories} onToggle={(categoryName) => toggleCategory(categoryName)} onClear={() => setSelectedCategories([])} />
                        )}
                    </div>
                    <Button
                        onClick={() => setShowAddCard(!showAddCard)}
                        text={
                            <span className="hidden md:inline">
                            {showAddCard ? "Close" : "Add"}
                        </span>
                        }
                        icon={showAddCard ? <CrossIcon/> : <PlusIcon />}
                        iconPosition={"start"}
                        className="bg-yellow500"
                    />
                    <label className="flex items-center gap-2 ml-4 cursor-pointer group whitespace-nowrap">
                        <input
                            type="checkbox"
                            checked={hideMastered}
                            onChange={(e) => setHideMastered(e.target.checked)}
                            className="w-4 h-4 rounded border-neutral900 text-yellow500 focus:ring-yellow500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-neutral900 group-hover:text-neutral700 transition-colors">
                            Hide Mastered
                        </span>
                    </label>
                </div>

                <Button onClick={() => {}} text={<span className="hidden md:inline">Shuffle</span>} icon={<ShuffleIcon />} iconPosition={"start"} />
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
                    filteredFlashcards.map((card: any) => (
                        <Card
                            key={card.id}
                            id={card.id.toString()}
                            question={card.question}
                            answer={getAnswerPreview(card)}
                            category={card.categories?.[0] || "General"}
                            progress={card.correct_count ?? 0}
                            target={5}
                        />
                    ))
                )}
            </div>
        </div>
    );
}