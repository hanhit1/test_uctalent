import { useState, useEffect, Dispatch, SetStateAction } from "react";

export const useDebounce = <T>(value: T, delay: number): { debouncedValue: T; setDebouncedValue: Dispatch<SetStateAction<T>> } => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler =  setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [value, delay])
    
    return {debouncedValue, setDebouncedValue}
    
} 