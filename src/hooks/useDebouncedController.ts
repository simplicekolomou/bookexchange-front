import {useEffect, useState} from "react";

export const useDebouncedController = (delay: number, inputValue: string) => {
    // Debounce
    const debounced = useDebounced(inputValue, delay);

    /* ---------- small debounce hook ---------- */
    function useDebounced<T>(value: T, delay = 500) {
        const [v, setV] = useState(value);
        useEffect(() => {
            const t = setTimeout(() => setV(value), delay);
            return () => clearTimeout(t);
        }, [value, delay]);
        return v;
    }

    return {debounced};
}