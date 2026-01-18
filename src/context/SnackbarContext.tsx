import {createContext, useContext, useState, ReactNode, JSX, useEffect} from 'react';
import CrossIcon from "../assets/images/icon-cross.svg?react";
import {useLocation} from "react-router-dom";

interface SnackbarMessage {
    id: number;
    text: string;
}

interface SnackbarContextType {
    showSnackbar: (text: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }): JSX.Element {
    const [messages, setMessages] = useState<SnackbarMessage[]>([]);
    const location = useLocation();

    useEffect(() => {
        setMessages([]);
    }, [location.pathname]);

    const showSnackbar = (text: string) => {
        const id = Date.now();
        setMessages((prev) => [...prev, { id, text }]);

        setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
        }, 3000);
    };

    const removeSnackbar = (id: number) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <div className="fixed top-[100px] right-6 z-[9999] flex flex-col gap-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="flex justify-between items-center gap-4 bg-neutral0 text-neutral900 px-4 py-3 rounded-full border border-neutral900 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] animate-in fade-in slide-in-from-right-4 min-w-[300px]"
                    >
                        <span className="text-preset5 font-medium">{msg.text}</span>
                        <button
                            onClick={() => removeSnackbar(msg.id)}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <CrossIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </SnackbarContext.Provider>
    );
}

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) throw new Error("useSnackbar must be used within SnackbarProvider");
    return context;
};