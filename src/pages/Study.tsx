import {JSX, useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import StatsTotalIcon from "../assets/images/icon-stats-total.svg?react";
import StatsInProgressIcon from "../assets/images/icon-stats-in-progress.svg?react";
import StatsMasteredIcon from "../assets/images/icon-stats-mastered.svg?react";
import StatsNotStartedIcon from "../assets/images/icon-stats-not-started.svg?react";
import {StatsItem} from "../components/stats/StatsItem.tsx";
import {FlashcardDisplay} from "../components/flashcards/FlashcardDisplay.tsx";
import {FlashcardHeader} from "../components/flashcards/FlashcardHeader.tsx";
import {FlashcardFooter} from "../components/flashcards/FlashcardFooter.tsx";
import {apiService} from "../services/api.ts";


export function Study(): JSX.Element {
    const [showAnswer, setShowAnswer] = useState(false);
    const [card, setCard] = useState<any>(null);
    const [error, setError] = useState(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        setShowAnswer(false);

        if (id) {
            apiService.getById(id)
                .then(setCard)
                .catch(err => setError(err.message));
        }
    }, [id]);

    if (error) return <div className="p-10 text-red-500">Error: {error}</div>;
    if (!card) return <div className="p-10">Loading...</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[631px] w-full lg:px-24 md:px-8 px-4 py-4">
            <div className="bg-neutral0 lg:w-2/3 h-fit lg:h-full flex items-center justify-center flex-col w-full border-1 border-neutral900 rounded-20 overflow-hidden">
                <FlashcardHeader selectedCategory={"All Categories"} />

                <FlashcardDisplay
                    currentStep={1}
                    totalSteps={5}
                    category={card.categories?.[0] ?? "General"}
                    type={card.flashcard_type}
                    content={card.flashcard_content}
                    question={card.question}
                    showAnswer={showAnswer}
                    onToggle={() => setShowAnswer(!showAnswer)}
                />

                <FlashcardFooter
                    currentCard={card.id}
                    totalCards={40}
                    onPrevious={() => {}}
                    onNext={() => {}}
                />
            </div>

            <div className="bg-neutral0 lg:w-1/3 w-full h-fit lg:h-full lg:items-stretch px-6 py-5 rounded-16 border-1 border-neutral900 overflow-hidden flex-col gap-4">
                <h2 className="text-preset2 font-poppins text-neutral-900 mb-4">Study Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 flex-1 lg:flex lg:flex-col lg:justify-between">
                    <StatsItem label={"Total Cards"} value={40} icon={<StatsTotalIcon />} iconBgColor={"bg-blue400"} />
                    <StatsItem label={"Mastered"} value={11} icon={<StatsMasteredIcon />} iconBgColor={"bg-teal400"} />
                    <StatsItem label={"In Progress"} value={21} icon={<StatsInProgressIcon />} iconBgColor={"bg-pink500"} />
                    <StatsItem label={"Not Started"} value={8} icon={<StatsNotStartedIcon />} iconBgColor={"bg-pink400"} />
                </div>
            </div>
        </div>
    )
}