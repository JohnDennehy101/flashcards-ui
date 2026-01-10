const BASE_URL = "http://localhost:4000/v1";

// Hardcoded for testing - DO NOT COMMIT
const DEV_TOKEN = "###";

async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    headers.set("Authorization", `Bearer ${DEV_TOKEN}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    return response;
}

export const apiService = {
    async getAll(params?: { section?: string; categories?: string[] }) {
        const query = new URLSearchParams();
        if (params?.section) query.append("section", params.section);
        if (params?.categories) query.append("categories", params.categories.join(","));

        const res = await apiRequest(`/flashcards?${query.toString()}`);
        return await res.json(); // returns { flashcards: [], metadata: {} }
    },

    async getById(id: string | number) {
        const res = await apiRequest(`/flashcards/${id}`);
        const data = await res.json();
        return data.flashcard;
    }
};