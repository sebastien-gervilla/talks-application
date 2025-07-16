// Librairies
import { useState } from "react";

interface PaginationModel {
    page: number;
    pageSize: number;
}

const usePagination = (initialPaginationModel = defaultPaginationModel) => {

    const [model, setModel] = useState(initialPaginationModel);

    const set = (page: number) => {
        setModel(current => ({
            ...current,
            page,
        }));
    };

    return {
        model,
        setModel,
        set
    }
}

const defaultPaginationModel: PaginationModel = {
    page: 1,
    pageSize: 100,
}

export default usePagination;