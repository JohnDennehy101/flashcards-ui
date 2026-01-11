import React, {createContext, useContext, useState, useEffect, useCallback, useRef} from 'react';
import { apiService } from '../services/api';

interface FlashcardStats {
    total: number;
    mastered: number;
    in_progress: number;
    not_started: number;
}

interface Category {
    name: string;
    count: number;
}

interface FlashcardContextType {
    flashcards: any[];
    categories: Category[];
    stats: FlashcardStats | null;
    isLoading: boolean;
    error: string | null;
    refreshData: (force?: boolean) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [stats, setStats] = useState<FlashcardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isFetchingRef = useRef(false);
    const hasInitializedRef = useRef(false);

    const loadData = useCallback(async (force = false) => {
        if (isFetchingRef.current) return;

        if (!force && hasInitializedRef.current) {
            setIsLoading(false);
            return;
        }

        try {
            isFetchingRef.current = true;
            setError(null);

            const [cardsData, statsData, categoriesData] = await Promise.all([
                apiService.getAll(),
                apiService.getStats(),
                apiService.getCategories()
            ]);

            setFlashcards(cardsData.flashcards);
            setStats(statsData);
            setCategories(categoriesData.categories);
            hasInitializedRef.current = true;
        } catch (err) {
            console.error(err);
            setError("Failed to sync data.");
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <FlashcardContext.Provider value={{
            flashcards,
            categories,
            stats,
            isLoading,
            error,
            refreshData: loadData
        }}>
            {children}
        </FlashcardContext.Provider>
    );
}

export const useFlashcards = () => {
    const context = useContext(FlashcardContext);
    if (context === undefined) {
        throw new Error('useFlashcards must be used within a FlashcardProvider');
    }
    return context;
};