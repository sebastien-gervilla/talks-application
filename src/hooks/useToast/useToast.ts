// Librairies
import { ReactElement, useState } from "react";

// Application
import { ToastVariant } from "@/components/Toast/Toast";

const useToast = () => {

    const [toast, setToast] = useState<ToastState>({
        isOpened: false,
        variant: 'positive',
        description: '',
    });

    const open = (model: OpenToastModel) => {
        setToast({
            ...model,
            isOpened: true,
        });
    }

    const close = () => {
        setToast({
            isOpened: false,
            variant: 'neutral',
            description: '',
        });
    }

    const openDefaultSuccess = () => {
        open({
            variant: 'positive',
            title: "Succès",
            description: "Mise à jour réalisée avec succès",
        });
    };

    const openDefaultFailure = () => {
        open({
            variant: 'destructive',
            title: "Une erreur est survenue",
            description: "Veuillez réessayer. Si le problème persiste, contactez un administrateur.",
        });
    };

    return {
        ...toast,
        open,
        close,
        onClose: close,
        openDefaultSuccess,
        openDefaultFailure,
    }
}

interface ToastState {
    isOpened: boolean;
    variant: ToastVariant;
    title?: string;
    description: string;
    action?: ReactElement;
}

interface OpenToastModel {
    variant: ToastVariant;
    title?: string;
    description: string;
    action?: ReactElement;
}

export default useToast;