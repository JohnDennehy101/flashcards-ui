import {JSX, useState, useEffect, useMemo} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Category, useFlashcards} from "../context/FlashcardContext";
import StatsTotalIcon from "../assets/images/icon-stats-total.svg?react";
import StatsInProgressIcon from "../assets/images/icon-stats-in-progress.svg?react";
import StatsMasteredIcon from "../assets/images/icon-stats-mastered.svg?react";
import StatsNotStartedIcon from "../assets/images/icon-stats-not-started.svg?react";
import {StatsItem} from "../components/stats/StatsItem.tsx";
import {FlashcardDisplay} from "../components/flashcards/FlashcardDisplay.tsx";
import {FlashcardHeader} from "../components/flashcards/FlashcardHeader.tsx";
import {FlashcardFooter} from "../components/flashcards/FlashcardFooter.tsx";
import {apiService} from "../services/api.ts";
import {CategoryDropdown} from "../components/dropdowns/CategoryDropdown.tsx";

export function Study(): JSX.Element {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {flashcards, stats, isLoading: contextLoading, refreshData, categories, selectedCategories, setSelectedCategories, hideMastered, setHideMastered, shuffleCards} = useFlashcards();

    const [showAnswer, setShowAnswer] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCategories, setShowCategories] = useState(false);

    const filteredFlashcards = useMemo(() => {
        return flashcards.filter(card => {
            const matchesCategory = selectedCategories.length === 0 ||
                card.categories?.some((cat: Category) => selectedCategories.includes(cat));

            const matchesMastery = !hideMastered || card.status !== "mastered";

            return matchesCategory && matchesMastery;
        });
    }, [flashcards, selectedCategories, hideMastered]);

    const card = useMemo(() => {
        return filteredFlashcards.find(f => f.id === Number(id));
    }, [filteredFlashcards, id]);

    useEffect(() => {
        if (!contextLoading && !card && filteredFlashcards.length > 0) {
            navigate(`/study/${filteredFlashcards[0].id}`, { replace: true });
        }
    }, [card, filteredFlashcards, contextLoading, navigate]);

    const handleNavigation = (direction: 'next' | 'prev') => {
        if (!filteredFlashcards.length) return;

        const currentIndex = filteredFlashcards.findIndex(f => f.id === Number(id));

        if (currentIndex === -1) {
            navigate(`/study/${filteredFlashcards[0].id}`);
            return;
        }

        let nextIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % filteredFlashcards.length;
        } else {
            nextIndex = (currentIndex - 1 + filteredFlashcards.length) % filteredFlashcards.length;
        }

        navigate(`/study/${filteredFlashcards[nextIndex].id}`);
    };

    const toggleCategory = (categoryName: string) => {
        setSelectedCategories((prev: Category[]) => {
            const isAlreadySelected = prev.some(c => c.name === categoryName);

            if (isAlreadySelected) {
                return prev.filter(c => c.name !== categoryName);
            } else {
                const categoryObject = categories.find(c => c.name === categoryName);
                return categoryObject ? [...prev, categoryObject] : prev;
            }
        });
    };

    if (error) return <div className="p-10 text-red-500">Error: {error}</div>;
    if (contextLoading) return <div className="p-10">Loading context...</div>;
    if (filteredFlashcards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[631px] w-full border-1 border-neutral900 rounded-20 bg-neutral0">
                <p className="text-preset3 text-neutral600">No cards match your filters.</p>
            </div>
        );
    }
    if (!card) {
        return <div className="p-10">Finding card...</div>;
    }

    const currentPos = filteredFlashcards.findIndex(f => f.id === Number(id)) + 1;

    const handleReview = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await apiService.review(id!);
            await refreshData(true);
            handleNavigation('next');
        } catch (err) {
            console.error(err);
        }
    };

    const handleReset = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure?")) return;

        try {
            await apiService.reset(id!);
            await refreshData(true);
        } catch (err) {
            console.error("Failed to reset progress:", err);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[631px] w-full lg:px-24 md:px-8 px-4 py-4">
            <div
                className="bg-neutral0 lg:w-2/3 h-fit lg:h-full flex items-center justify-center flex-col w-full border-1 border-neutral900 rounded-20 overflow-hidden">
                <FlashcardHeader
                    selectedCategory={selectedCategories.length > 0 ? `${selectedCategories.length} Selected` : "All Categories"}
                    hideMastered={hideMastered}
                    onCategoryClick={() => setShowCategories(!showCategories)}
                    onShuffleClick={() => {
                        shuffleCards();
                        setShowAnswer(false);

                        if (filteredFlashcards.length > 0) {
                            navigate(`/study/${filteredFlashcards[0].id}`);
                        }
                    }}
                    onHideMasteredChange={(checked: boolean) => setHideMastered(checked)}
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
                    category={card.categories?.[0] ?? ""}
                    type={card.flashcard_type}
                    content={card.flashcard_content}
                    question={card.question}
                    showAnswer={showAnswer}
                    onToggle={() => setShowAnswer(!showAnswer)}
                    onReview={handleReview}
                    onReset={handleReset}
                />

                <FlashcardFooter
                    currentCard={currentPos}
                    totalCards={filteredFlashcards.length}
                    onPrevious={() => handleNavigation('prev')}
                    onNext={() => handleNavigation('next')}
                />
            </div>

            <div
                className="bg-neutral0 lg:w-1/3 w-full h-fit lg:h-full lg:items-stretch px-6 py-5 rounded-16 border-1 border-neutral900 overflow-hidden flex-col gap-4">
                <h2 className="text-preset2 font-poppins text-neutral-900 mb-4">Study Statistics</h2>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 flex-1 lg:flex lg:flex-col lg:justify-between">
                    <StatsItem label={"Total Cards"} value={stats?.total ?? 0} icon={<StatsTotalIcon/>}
                               iconBgColor={"bg-blue400"}/>
                    <StatsItem label={"Mastered"} value={stats?.mastered ?? 0} icon={<StatsMasteredIcon/>}
                               iconBgColor={"bg-teal400"}/>
                    <StatsItem label={"In Progress"} value={stats?.in_progress ?? 0} icon={<StatsInProgressIcon/>}
                               iconBgColor={"bg-pink500"}/>
                    <StatsItem label={"Not Started"} value={stats?.not_started ?? 0} icon={<StatsNotStartedIcon/>}
                               iconBgColor={"bg-pink400"}/>
                </div>
            </div>
        </div>
    );
}