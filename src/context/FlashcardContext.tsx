import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
    Dispatch,
    SetStateAction
} from 'react';
import { apiService } from '../services/api';

interface FlashcardStats {
    total: number;
    mastered: number;
    in_progress: number;
    not_started: number;
}

export interface Category {
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
    selectedCategories: Category[];
    setSelectedCategories: Dispatch<SetStateAction<Category[]>>;
    hideMastered: boolean;
    setHideMastered: Dispatch<SetStateAction<boolean>>;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<FlashcardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [hideMastered, setHideMastered] = useState(false);

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
            refreshData: loadData,
            selectedCategories,
            setSelectedCategories,
            hideMastered,
            setHideMastered
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