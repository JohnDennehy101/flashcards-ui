import {JSX} from "react";
import { useNavigate } from "react-router-dom";
import {ProgressBar} from "../../components/progress/ProgressBar.tsx";
import {CardMenu} from "../../components/menus/CardMenu.tsx";
import {Button} from "../../components/buttons/Button.tsx";
import MasteredIcon from "../../assets/images/icon-mastered.svg?react"

interface CardProps {
    id: string;
    question: string;
    answer: string;
    category: string;
    progress: number;
    target: number;
    isMenuOpen: boolean;
    onMenuToggle: (isOpen: boolean) => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function Card({ id, question, answer, category, progress, target, isMenuOpen, onMenuToggle, onEdit, onDelete }: CardProps) : JSX.Element {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/study/${id}`);
    };
    return <div className="flex border rounded-8 bg-neutral0 flex-col justify-between w-full h-full cursor-pointer hover:border-neutral900" onClick={handleCardClick} data-menu-container="true">
        <div className="overflow-hidden">
            <h2 className="text-preset3 p-4">{question}</h2>
        </div>
        <div className="p-4 flex flex-col gap-4 border-t flex-1">
            <h3 className="text-preset5 text-neutral-900">Answer:</h3>
            <p className="text-preset5">{answer}</p>
        </div>
        <div className="flex justify-between gap-4 border-t">

            <div className="flex items-center p-2.5 border-r gap-2 py-4">
                <span className="text-preset6 text-neutral-900 py-1.5 px-3 border rounded-full">{category}</span>
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
                            className="whitespace-nowrap px-2.5 py-1.5 bg-teal400 text-preset6 font-poppins hover:translate-y-0 hover:shadow-none cursor-default"
                            iconPosition={"start"}
                            icon={<MasteredIcon />}
                        />
                    )}
                </div>
            </div>

            <div
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <CardMenu onEdit={onEdit} onDelete={onDelete} isOpen={isMenuOpen} onToggle={onMenuToggle} />
            </div>
        </div>
    </div>
}