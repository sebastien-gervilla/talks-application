import { PopoverOrigin, Position } from "@/components/Popover/types";
import { ReactNode, useState } from "react"

const usePopover = () => {

    const [popover, setPopover] = useState<State>({
        isOpened: false,
        origin: null,
        body: null
    });

    const openFrom = (target: HTMLElement, body: State['body']) => setPopover({
        isOpened: true,
        origin: target,
        body
    });

    const openFromPosition = (position: Position, body: State['body']) => setPopover({
        isOpened: true,
        origin: position,
        body
    });

    const close = () => {
        setPopover({
            isOpened: false,
            origin: null,
            body: null
        });
    }

    return {
        ...popover,
        openFrom,
        openFromPosition,
        close,
        onClose: close
    };
}

type State = {
    isOpened: boolean;
    origin: PopoverOrigin;
    body: ReactNode;
}

export default usePopover;