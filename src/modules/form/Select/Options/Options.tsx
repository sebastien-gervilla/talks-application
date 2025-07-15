// Libraries
import { JSX, useRef, useEffect } from "react";
import { createPortal } from 'react-dom';
import useResizeObserver from "@react-hook/resize-observer";

// Application
import './options.scss';

interface Props {
    anchor: HTMLDivElement
    options: JSX.Element[] | JSX.Element
    onOptionClick: () => void
    maxHeight?: number
}

const Options = ({
    anchor,
    options,
    onOptionClick,
    maxHeight = 350
}: Props) => {

    const optionsRef = useRef<HTMLDivElement | null>(null);

    useResizeObserver(anchor, ({ target }) => resizeOptions(optionsRef.current, target));

    useEffect(() => {
        const handleClickOut = (event: any) => {
            const modal = optionsRef.current;
            if (modal && !modal.contains(event.target) && !anchor.contains(event.target))
                onOptionClick();
        }

        document.addEventListener('mousedown', handleClickOut);

        return () => { document.removeEventListener('mousedown', handleClickOut) };
    }, [optionsRef]);

    return createPortal(
        <div
            ref={optionsRef}
            className='select-options'
            style={{ maxHeight }}
        >
            {options}
        </div>,
        document.body
    );
}

const defaultListPosition = {
    top: 0,
    left: 0,
    width: 200
}

const resizeOptions = (options: HTMLDivElement | null, anchor: Element) => {
    if (!options) return;

    let { top, left, width } = defaultListPosition;
    const rect = anchor.getBoundingClientRect();
    top = rect.top + rect.height + window.scrollY;
    left = rect.left;
    width = rect.width;

    options.style.display = 'block';
    options.style.top = `${top}px`;
    options.style.left = `${left}px`;
    options.style.width = `${width}px`;
}

export default Options;