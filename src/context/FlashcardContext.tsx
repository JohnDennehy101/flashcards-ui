import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

interface FlashcardStats {
    total: number;
    mastered: number;
    in_progress: number;
    not_started: number;
}

interface FlashcardContextType {
    flashcards: any[];
    stats: FlashcardStats | null;
    isLoading: boolean;
    error: string | null;
    refreshData: (force?: boolean) => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [stats, setStats] = useState<FlashcardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false); // Track active network request

    const refreshData = useCallback(async (force = false) => {
        if (isFetching) return;

        if (!force && flashcards.length > 0 && stats !== null) {
            setIsLoading(false);
            return;
        }

        try {
            setIsFetching(true);
            const [cardsData, statsData] = await Promise.all([
                apiService.getAll(),
                apiService.getStats()
            ]);
            setFlashcards(cardsData.flashcards);
            setStats(statsData);
        } catch (err) {
            console.error(err);
        } finally {
            setIsFetching(false);
            setIsLoading(false);
        }
    }, [flashcards.length, isFetching]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return (
        <FlashcardContext.Provider value={{
            flashcards,
            stats,
            isLoading,
            error,
            refreshData
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