import { JSX } from "react";
import { Button } from "../../components/buttons/Button.tsx";
import ChevronDownIcon from "../../assets/images/icon-chevron-down.svg?react";
import ShuffleIcon from "../../assets/images/icon-shuffle.svg?react";

interface FlashcardHeaderProps {
    onCategoryClick?: () => void;
    onShuffleClick?: () => void;
    onHideMasteredChange?: (hidden: boolean) => void;
    selectedCategory?: string;
}

export function FlashcardHeader({
                                    onCategoryClick = () => {},
                                    onShuffleClick = () => {},
                                    onHideMasteredChange = () => {},
                                    selectedCategory = "All Categories",
                                }: FlashcardHeaderProps): JSX.Element {
    return (
        <div className="bg-neutral0 lg:h-1/7 w-full border-b-1 border-neutral900">
            <div className="h-full w-full px-5 py-5 flex items-center justify-between">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <Button
                        text={selectedCategory}
                        onClick={onCategoryClick}
                        iconPosition={"end"}
                        icon={<ChevronDownIcon />}
                    />

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-neutral900 text-yellow500 focus:ring-yellow500 cursor-pointer"
                            onChange={(e) => onHideMasteredChange(e.target.checked)}
                        />
                        <span className="text-preset4-semibold font-poppins text-neutral900">
              Hide Mastered
            </span>
                    </label>
                </div>

                <div>
                    <Button
                        text={"Shuffle"}
                        onClick={onShuffleClick}
                        iconPosition={"start"}
                        icon={<ShuffleIcon />}
                    />
                </div>
            </div>
        </div>
    );
}