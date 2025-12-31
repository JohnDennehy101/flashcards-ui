import { JSX, ReactNode } from "react";

interface ButtonProps {
    text: ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary";
    icon?: ReactNode;
    iconPosition?: "start" | "end";
    className?: string;
}

export function Button({
                           text,
                           onClick,
                           variant = "primary",
                           icon,
                           iconPosition = "start",
                           className = "",
                       }: ButtonProps): JSX.Element {

    const baseStyles = "flex items-center justify-center gap-2 px-6 py-2 rounded-full font-poppins text-preset4-semibold transition-all duration-200 border-1 border-neutral900";

    const variants = {
        primary: "bg-neutral0 text-neutral900 shadow-sm hover:translate-y-[-1px]",
        secondary: "bg-white text-neutral900 hover:bg-neutral100",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {icon && iconPosition === "start" && <span>{icon}</span>}

            <span>{text}</span>

            {icon && iconPosition === "end" && <span>{icon}</span>}
        </button>
    );
}