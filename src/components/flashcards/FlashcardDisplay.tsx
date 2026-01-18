import {JSX, useState} from "react";
import { Button } from "../../components/buttons/Button.tsx";
import { ProgressBar } from "../../components/progress/ProgressBar.tsx";
import PatternStarPinkIcon from "../../assets/images/pattern-star-pink.svg?react";
import PatternStarBlueIcon from "../../assets/images/pattern-star-blue.svg?react";
import PatternStarYellowIcon from "../../assets/images/pattern-star-yellow.svg?react";
import TickIcon from "../../assets/images/icon-circle-check.svg?react"
import ResetProgressIcon from "../../assets/images/icon-reset.svg?react";
import MasteredIcon from "../../assets/images/icon-mastered.svg?react"
import { Modal } from "../../components/modals/Modal.tsx";

interface FlashcardDisplayProps {
    type: 'qa' | 'mcq' | 'yes_no';
    content: any;
    question: string;
    category: string;
    currentStep: number;
    totalSteps: number;
    showAnswer: boolean;
    onToggle: () => void;
    onReview: (e: React.MouseEvent) => Promise<void>;
    onReset: (e: React.MouseEvent) => Promise<void>;
}

export function FlashcardDisplay({
                                     type,
                                     content,
                                     question,
                                     category,
                                     currentStep,
                                     totalSteps,
                                     showAnswer,
                                     onToggle,
                                     onReview,
                                     onReset
                                 }: FlashcardDisplayProps): JSX.Element {

    const [isJustificationOpen, setIsJustificationOpen] = useState(false);

    const getFormattedAnswer = () => {
        if (!content) return "";
        switch (type) {
            case 'qa': return content.answer;
            case 'yes_no': return `${content.correct ? "YES" : "NO"}`;
            case 'mcq': return content.options?.[content.correct_index] || "";
            default: return "";
        }
    };

    const getHighlightedText = (text: string, highlight: string) => {
        if (!highlight || !text) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <mark key={i} className="bg-yellow500 text-neutral900 rounded-sm px-1 font-bold">
                            {part}
                        </mark>
                    ) : (
                        part
                    )
                )}
            </span>
        );
    };

    console.log(content);

    const isMcq = type === 'mcq';

    const questionTextSize = isMcq
        ? "text-[20px] md:text-[24px] lg:text-[28px]"
        : "text-preset1-mobile md:text-preset1-tablet lg:text-preset1";

    const backgroundCardColor = showAnswer ? "bg-blue400" : "bg-pink400";

    const containerHeight = type === 'mcq' ? "h-[460px]" : "h-[400px]";

    return (
        <div className={`bg-neutral0 ${containerHeight} w-full px-5 py-5 flex flex-col transition-all duration-300`}>
            <div
                onClick={onToggle}
                className={`relative w-full h-full flex flex-col border border-neutral900 rounded-[20px] cursor-pointer overflow-hidden transition-colors duration-300 ${backgroundCardColor}`}
            >
                <div className="absolute top-6 w-full flex justify-center z-20">
                    <Button
                        onClick={(e) => e.stopPropagation()}
                        text={category}
                        className="text-preset6 font-poppins hover:translate-y-0 hover:shadow-none cursor-default"
                    />
                </div>

                <div className="absolute top-10 right-10 transition-transform duration-500 z-10">
                    {showAnswer ? <PatternStarPinkIcon /> : <PatternStarBlueIcon />}
                </div>

                <div className="relative w-full h-full flex flex-col items-center">

                    <div className={`absolute inset-0 flex flex-col items-center px-6 transition-all duration-200
    ${showAnswer ? "translate-y-8 opacity-0 pointer-events-auto" : "translate-y-0 opacity-100 pointer-events-none"}
    ${type === 'mcq' ? "justify-start pt-18" : "justify-center"}`}
                    >
                        <div className={`w-full flex items-center justify-center ${type === 'mcq' ? 'mb-2' : ''}`}>
                            <p className={`${questionTextSize} font-poppins text-neutral900 text-center leading-[1.1]`}>
                                {question}
                            </p>
                        </div>

                        {type === 'mcq' ? (
                            <>
                                <div className="w-full flex flex-col gap-1.5 z-20">
                                    {content.options?.slice(0, 4).map((opt: string, i: number) => (
                                        <div key={i} className="w-full px-4 py-1.5 border border-neutral900/15 rounded-12 bg-neutral0/20">
                                            <p className="text-[11px] md:text-[12px] font-poppins text-center leading-tight text-neutral900">
                                                {opt}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {!isMcq && <div className="absolute bottom-12 w-full flex justify-center pointer-events-none">
                                    <p className="text-preset4 font-poppins text-neutral900 text-center">
                                        {"Click to reveal answer"}
                                    </p>
                                </div>}
                            </>
                        ) : (
                            <p className="text-preset4 font-poppins text-neutral900 text-center mt-4">
                                {"Click to reveal answer"}
                            </p>
                        )}
                    </div>

                    <div className={`absolute inset-0 flex flex-col items-center justify-center px-10 transition-all
                        ${showAnswer ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}
                    >
                        <p className="text-preset4 font-poppins text-neutral900 text-center">
                            {"Answer:"}
                        </p>
                        <p className="text-preset2 font-poppins text-neutral900 py-4 text-center leading-tight">
                            {getFormattedAnswer()}
                        </p>

                        {(content?.justification || content?.text) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsJustificationOpen(true);
                                }}
                                className="mt-2 text-preset6 font-bold text-neutral900 underline decoration-2 underline-offset-4 cursor-pointer"
                            >
                                View Justification
                            </button>
                        )}
                    </div>
                </div>

                <div className={`absolute ${currentStep < totalSteps ? "bottom-6 w-18" : "bottom-4"} left-1/2 -translate-x-1/2 z-10`}>
                    {currentStep < totalSteps ? <ProgressBar current={currentStep} total={totalSteps} />
                        : <Button onClick={() => {}} text={`Mastered ${currentStep}/${totalSteps}`} className="px-2.5 py-1.5 bg-teal400 text-preset6 font-poppins hover:translate-y-0 hover:shadow-none cursor-default" iconPosition={"start"} icon={<MasteredIcon />} />}
                </div>

                <div className={`absolute bottom-10 transition-all duration-300 ease-in-out ${showAnswer ? "left-6" : "left-10"}`}>
                    <PatternStarYellowIcon />
                </div>
            </div>

            <div className="flex flex-row gap-5 pt-5 items-center justify-center shrink-0">
                <Button text={"I Know This"} onClick={onReview} iconPosition={"start"} icon={<TickIcon />} className="bg-yellow500 cursor-pointer" />
                <Button text={"Reset Progress"} onClick={onReset} iconPosition={"start"} icon={<ResetProgressIcon />} className="cursor-pointer" />
            </div>

            <Modal
                isOpen={isJustificationOpen}
                onClose={() => setIsJustificationOpen(false)}
                title="Source & Justification"
                size="2xl"
            >
                <div className="space-y-6 py-2">
                    <div className="space-y-2">
                        <h4 className="text-preset5 font-bold text-neutral900">Justification</h4>
                        <p className="p-4 bg-blue50 border border-neutral900 rounded-12 italic text-neutral900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {content.justification}
                        </p>
                    </div>

                    {content.text && (
                        <div className="space-y-2">
                            <h4 className="text-preset5 font-bold text-neutral900">Source Context</h4>
                            <div className="p-4 border border-neutral900 rounded-12 bg-neutral0 leading-relaxed text-neutral900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-h-[300px] overflow-y-auto">
                                {getHighlightedText(content.text, content.justification)}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <Button text="Got it" onClick={() => setIsJustificationOpen(false)} className="bg-yellow500" />
                    </div>
                </div>
            </Modal>
        </div>
    );
}