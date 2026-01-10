import { useState } from "react";
import {Button} from "../../components/buttons/Button.tsx";
import MenuIcon from "../../assets/images/icon-menu.svg?react";
import EditIcon from "../../assets/images/icon-edit.svg?react";
import DeleteIcon from "../../assets/images/icon-delete.svg?react";

export function CardMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative border-l p-2.5 py-4 flex items-center">
            {isOpen && (
                <div className="absolute bottom-full right-2 mb-2 w-32 border bg-neutral0 rounded-lg shadow-sm z-10 overflow-hidden">
                    <Button text={"Edit"} onClick={() => {}} icon={<EditIcon />} iconPosition={"start"} variant={"menu"} className="border-b" />
                    <Button text={"Delete"} onClick={() => {}} icon={<DeleteIcon />} iconPosition={"start"} variant={"menu"} />
                </div>
            )}


            <Button
                icon={<MenuIcon />}
                onClick={() => setIsOpen(!isOpen)}
                className="!border !border-neutral200 !rounded-lg !p-0.5 cursor-pointer"
            />
        </div>
    );
}