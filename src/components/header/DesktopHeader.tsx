import { NavLink } from "react-router-dom";
import {JSX} from "react";
import Logo from "../../assets/images/logo-large.svg?react";

export function DesktopHeader(): JSX.Element {
    const baseStyles = "flex-1 text-center whitespace-nowrap text-neutral900 py-2 px-6 text-preset font-poppins text-preset4-semibold transition-all duration-100";
    const activeStyles = "bg-yellow500 border-1 border-neutral900 shadow-sm rounded-full";
    const inactiveStyles = "";

    return (
        <header className="w-full bg-neutral100 border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center px-21">
                <Logo className="w-40 h-10 fill-current" />

                <nav className="flex rounded-full bg-neutral100 border-1 border-neutral900 fill-neutral0  p-1 w-65">
                    <NavLink
                        to="/study"
                        className={({ isActive }) =>
                            `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                        }
                    >
                        Study Mode
                    </NavLink>

                    <NavLink
                        to="/option-two"
                        className={({ isActive }) =>
                            `${baseStyles} ${isActive ? activeStyles : inactiveStyles}`
                        }
                    >
                        All Cards
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}