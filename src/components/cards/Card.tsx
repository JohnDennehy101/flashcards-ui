import {JSX} from "react";
import { useNavigate } from "react-router-dom";
import {ProgressBar} from "../../components/progress/ProgressBar.tsx";
import {CardMenu} from "../../components/menus/CardMenu.tsx";

interface CardProps {
    id: string;
    question: string;
    answer: string;
    category: string;
    progress: number;
}

export function Card({ id, question, answer, category, progress }: CardProps) : JSX.Element {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/study/${id}`);
    };
    return <div className="flex border rounded-8 bg-neutral0 flex-col justify-between w-full h-full cursor-pointer hover:border-neutral900" onClick={handleCardClick}>
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


            <div className="flex flex-1 items-center justify-start">
                <div className="w-full max-w-[80px]">
                <ProgressBar current={progress} total={5} />
                </div>
            </div>

            <div
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <CardMenu />
            </div>
        </div>
    </div>
}