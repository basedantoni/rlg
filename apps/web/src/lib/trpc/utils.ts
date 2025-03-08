export function getBaseUrl() {
        if (typeof window !== "undefined") return "";
        if (process.env.BASE_URL) return `https://${process.env.BASE_URL}`;
        return "http://localhost:3000";
}

export function getUrl() {
        return getBaseUrl() + "/api/trpc";
}
