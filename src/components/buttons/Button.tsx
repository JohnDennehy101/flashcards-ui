import { JSX, ReactNode } from "react"
import { twMerge } from "tailwind-merge"
import { clsx, ClassValue } from "clsx"

interface ButtonProps {
  text?: ReactNode
  type?: "button" | "submit" | "reset"
  onClick: () => void
  variant?: "primary" | "secondary" | "icon" | "menu"
  icon?: ReactNode
  iconPosition?: "start" | "end"
  className?: string
  disabled?: boolean
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Button({
  text,
  type = "button",
  onClick,
  variant = "primary",
  icon,
  iconPosition = "start",
  className = "",
  disabled = false,
}: ButtonProps): JSX.Element {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 transition-all duration-200 font-poppins min-w-fit whitespace-nowrap"

  const variants = {
    primary:
      "px-3 md:px-6 py-2 rounded-12 border-1 border-neutral900 bg-neutral0 text-neutral900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-none",
    secondary:
      "px-3 md:px-6 py-2 rounded-full border-1 border-neutral900 bg-white text-neutral900 hover:bg-neutral100",
    icon: "bg-transparent shadow-none border-none p-0",
    menu: "w-full justify-start px-4 py-3 hover:bg-neutral100 text-preset5 text-neutral700",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyles, "h-10 md:h-auto", variants[variant], className)}
    >
      {icon && iconPosition === "start" && icon}
      {text}
      {icon && iconPosition === "end" && icon}
    </button>
  )
}
