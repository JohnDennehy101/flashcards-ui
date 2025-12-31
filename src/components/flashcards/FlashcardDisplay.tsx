import { JSX } from "react";
import { Button } from "../../components/buttons/Button.tsx";
import { ProgressBar } from "../../components/progress/ProgressBar.tsx";
import PatternStarPinkIcon from "../../assets/images/pattern-star-pink.svg?react";
import PatternStarBlueIcon from "../../assets/images/pattern-star-blue.svg?react";
import PatternStarYellowIcon from "../../assets/images/pattern-star-yellow.svg?react";
import TickIcon from "../../assets/images/icon-circle-check.svg?react"
import ResetProgressIcon from "../../assets/images/icon-reset.svg?react";

interface FlashcardDisplayProps {
    question: string;
    answer: string;
    currentStep: number;
    totalSteps: number;
    category: string;
    showAnswer: boolean;
    onToggle: () => void;
}

export function FlashcardDisplay({
                                     question,
                                     answer,
                                     category,
                                     currentStep,
                                     totalSteps,
                                     showAnswer,
                                     onToggle,
                                 }: FlashcardDisplayProps): JSX.Element {
    const backgroundCardColor = showAnswer ? "bg-blue400" : "bg-pink400";

    return (
        <div className="bg-neutral0 h-[360px] lg:h-5/7 w-full px-5 py-5 flex flex-col">
            <div
                onClick={onToggle}
                className={`relative w-full h-full flex flex-col items-center justify-center border border-neutral900 rounded-[20px] cursor-pointer overflow-hidden transition-colors duration-300 ${backgroundCardColor}`}
            >
                <Button
                    onClick={(e) => e.stopPropagation()}
                    text={category}
                    className="absolute top-6 text-preset6 font-poppins hover:translate-y-0 hover:shadow-none cursor-default z-10"
                />

                <div className="absolute top-10 right-10 transition-transform duration-500">
                    {showAnswer ? <PatternStarPinkIcon /> : <PatternStarBlueIcon />}
                </div>

                <div className="relative w-full h-full flex items-center justify-center">

                    <div className="absolute flex flex-col items-center">
                        <p className={`text-preset1-mobile md:text-preset1-tablet lg:text-preset1 font-poppins text-neutral900 px-16 text-center transition-all
              ${showAnswer
                            ? "translate-y-8 opacity-0 duration-200 pointer-events-none"
                            : "translate-y-0 opacity-100 duration-200"}`}
                        >
                            {question}
                        </p>

                        <p className={`text-preset4 font-poppins text-neutral900 px-16 py-4 text-center transition-all
              ${showAnswer
                            ? "-translate-y-12 opacity-0 duration-200"
                            : "translate-y-0 opacity-100 duration-200"}`}
                        >
                            {"Click to reveal answer"}
                        </p>
                    </div>

                    <div className="absolute flex flex-col items-center pointer-events-none">
                        <p className={`text-preset4 font-poppins text-neutral900 text-center transition-all
              ${showAnswer
                            ? "translate-y-0 opacity-100 duration-200"
                            : "translate-y-12 opacity-0 duration-0"}`}
                        >
                            {"Answer:"}
                        </p>

                        <p className={`text-preset2 font-poppins text-neutral900 px-16 py-4 text-center transition-all
              ${showAnswer
                            ? "translate-y-0 opacity-100 duration-200"
                            : "translate-y-4 opacity-0 duration-0"}`}
                        >
                            {answer}
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-18 z-10">
                    <ProgressBar current={currentStep} total={totalSteps} />
                </div>

                <div
                    className={`absolute bottom-10 transition-all duration-300 ease-in-out
            ${showAnswer ? "left-6" : "left-10"}`}
                >
                    <PatternStarYellowIcon />
                </div>
            </div>

            <div className="flex flex-row gap-5 pt-5 items-center justify-center">
                <Button text={"I Know This"} onClick={() => {}} iconPosition={"start"} icon={<TickIcon />} className="bg-yellow500" />
                <Button text={"Reset Progress"} onClick={() => {}} iconPosition={"start"} icon={<ResetProgressIcon />}  />
            </div>
        </div>
    );
}