import { JSX, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

interface ButtonProps {
    text?: ReactNode;
    type?: "button" | "submit" | "reset";
    onClick: () => void;
    variant?: "primary" | "secondary" | "icon" | "menu";
    icon?: ReactNode;
    iconPosition?: "start" | "end";
    className?: string;
}

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Button({
                           text,
                           type = "button",
                           onClick,
                           variant = "primary",
                           icon,
                           iconPosition = "start",
                           className = "",
                       }: ButtonProps): JSX.Element {

    const baseStyles =
        "inline-flex items-center justify-center gap-2 transition-all duration-200 font-poppins";

    const paddedStyles =
        "px-6 py-2 rounded-full text-preset4-semibold border-1 border-neutral900";


    const variants = {
        primary: `bg-neutral0 text-neutral900 shadow-sm hover:translate-y-[-1px] ${paddedStyles}`,
        secondary: `bg-white text-neutral900 hover:bg-neutral100 ${paddedStyles}`,
        icon: "bg-transparent shadow-none border-none px-0 py-0 hover:translate-y-0",
        menu: "cursor-pointer w-full justify-start px-4 py-3 hover:bg-neutral100 text-preset5 text-neutral700 transition-colors",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={cn(baseStyles, variants[variant], className)}
        >
            {icon && iconPosition === "start" && <span>{icon}</span>}

            {text && <span>{text}</span>}

            {icon && iconPosition === "end" && <span>{icon}</span>}
        </button>
    );
}