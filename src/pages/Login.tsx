import {JSX} from "react";
import Logo from "../assets/images/logo-large.svg?react";
import {LoginForm} from "../components/forms/LoginForm.tsx";

export function Login(): JSX.Element {
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-neutral50 p-8">
            <div className="flex flex-col border border-neutral100 rounded-12
                w-full max-w-[343px]
                md:max-w-[522px]
                lg:max-w-[540px]
                min-h-[403px]
                md:min-h-[219px]
                lg:min-h-[400px]
                bg-neutral0 shadow-sm overflow-hidden"
            >
                <div className="flex flex-col items-center px-4 md:px-8 pt-10 md:pt-12 pb-8 gap-6">
                    <Logo className="w-32 md:w-40 h-auto fill-current text-neutral900" />
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-[24px] md:text-preset2 font-poppins text-neutral900">Welcome to Flashcards</h1>
                        <p className="text-preset5 text-neutral600">Please log in to continue</p>
                    </div>
                </div>

                <div className="px-4 md:px-8 pb-12">
                <LoginForm />
                </div>
            </div>
        </div>
    );
}