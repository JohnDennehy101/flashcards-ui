import { ReactNode } from "react";
import { createPortal } from "react-dom";
import CrossIcon from "../../assets/images/icon-cross.svg?react";
import {Button} from "../../components/buttons/Button.tsx";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full';
    type?: 'edit' | 'delete';
}

export function Modal({ isOpen, onClose, title, children, size = "2xl", type = "edit" }: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-[95vw]'
    };

    const typeClasses = {
        edit: 'p-6',
        delete: 'px-6'
    }

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-neutral900/60"
                onClick={onClose}
            />

            <div className={`relative bg-neutral0 w-full ${sizeClasses[size]} max-w-2xl max-h-[90vh] overflow-y-auto rounded-12 z-10`}>
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-preset2 font-bold">{title}</h2>
                    <Button
                        onClick={onClose}
                        variant="icon"
                        icon={<CrossIcon />}
                        className="hover:bg-neutral100 rounded-full"
                    />
                </div>

                <div className={`${typeClasses[type]}`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}