import { ReactNode, useState } from "react";

const useModal = (body?: ReactNode) => {
    const [modal, setModal] = useState<ModalState>({
        isOpened: false,
        body,
    });

    const openWith = (newBody: ReactNode, options?: Options) => setModal({
        ...modal,
        ...defaultOptions,
        isOpened: true,
        body: newBody,
        ...options
    });

    const close = () => {
        setModal({
            body: null,
            isOpened: false,
        });
        
        modal.onClose?.();
    };

    return {
        self: modal,
        isOpened: modal.isOpened,
        body: modal.body,

        openWith,
        close,
        onClose: close,

        set: setModal
    }
}

type ModalState = {
    isOpened: boolean;
    body: ReactNode;
    onClose?: () => void;
}

type Options = {
    onClose?: ModalState['onClose'];
}

const defaultOptions: Options = {
    onClose: undefined,
}

export default useModal;