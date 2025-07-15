import { MutableRefObject, useEffect } from "react";

export type ClickOutsideTarget = HTMLElement | null | MutableRefObject<HTMLElement | null>;

export default function useClickOutside(
    target: ClickOutsideTarget | ClickOutsideTarget[], 
    onClickOutside: () => void
) {

    const handleClickOut = (event: MouseEvent) => {
        if (!target) return;

        if (!Array.isArray(target)) {
            const targetElement = target instanceof HTMLElement
                ? target 
                : target.current;
            
            if (targetElement && !targetElement.contains(event.target as Node))
                onClickOutside();

            return;
        }

        let clickedOutside = true;
        for (const element of target) {
            if (!element)
                continue;
            
            const targetElement = element instanceof HTMLElement
                ? element
                : element.current;
            
            if (targetElement && targetElement.contains(event.target as Node))
                clickedOutside = false;
        }

        if (clickedOutside)
            return onClickOutside();
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOut);

        return () => {
            document.removeEventListener('mousedown', handleClickOut);
        };
    }, [target, onClickOutside]);
}