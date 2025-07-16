import { PopoverOrigin, PopoverPosition, Position, PositionMultiplier } from "./types";

export const getPopoverPosition = (origin: PopoverOrigin, popupPosition: PopoverPosition = defaultAnchoredPosition) => {
    if (!origin)
        return defaultPosition;

    if (isOriginPosition(origin))
        return {top: origin.y, left: origin.x, transform: 'translate(0, 0)'};

    const position = getPopoverRect(origin, popupPosition);
    const transform = getPopoverTransform(popupPosition);

    return {
        top: position.top,
        left: position.left,
        transform
    }
}

const getPopoverRect = (anchor: HTMLElement, position: PopoverPosition) => {
    const rect = anchor.getBoundingClientRect();
    const topOrigin = PositionMultiplier[position?.anchorOrigin?.vertical || 'center'];
    const leftOrigin = PositionMultiplier[position?.anchorOrigin?.horizontal || 'right'];
    const top = rect.top + rect.height * topOrigin;
    const left = rect.left + rect.width * leftOrigin;

    const scroll = window.scrollY;

    return {
        top: (Math.ceil(top + (position?.gap?.vertical || 0)) + scroll) + 'px',
        left: Math.ceil(left + (position?.gap?.horizontal || 0)) + 'px'
    }
}

const getPopoverTransform = (position: PopoverPosition) => {
    const xOrigin = PositionMultiplier[position?.bodyOrigin?.horizontal || 'left'];
    const yOrigin = PositionMultiplier[position?.bodyOrigin?.vertical || 'top'];
    const transformX = -100 * xOrigin;
    const transformY = -100 * yOrigin;
    return `translate(${transformX}%, ${transformY}%)`;
}

const isOriginPosition = (origin: PopoverOrigin): origin is Position => !(origin instanceof HTMLElement);

const defaultPosition = {
    top: 0,
    left: 0
}

const defaultAnchoredPosition: PopoverPosition = {
    anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
    },
    bodyOrigin: {
        vertical: 'top',
        horizontal: 'left'
    },
    gap: {
        vertical: 8,
        horizontal: 8
    }
}