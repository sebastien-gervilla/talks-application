import { HttpResponse } from "../request.types";

export class Response<Responses extends HttpResponse, Body = Responses[keyof Responses]> {
    
    public ok: boolean;
    public status: number;
    public statusText: string;
    public body: Body;

    constructor(
        ok: boolean,
        status: number,
        statusText: string,
        body: Body,
    ) {
        this.ok = ok;
        this.status = status;
        this.statusText = statusText;
        this.body = body;
    }

    is = <Code extends keyof Responses>(code: Code): this is Response<Responses, Responses[Code]> => {
        return this.status === code;
    }
}