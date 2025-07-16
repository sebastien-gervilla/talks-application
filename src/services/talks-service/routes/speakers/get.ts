import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const get = async (controller?: AbortController) => {

    const options = controller ? {
        signal: controller.signal
    } : undefined;

    const response = await Request.get<
        TalksService.Requests.Speaker.Get,
        TalksService.Responses.Speaker.Get
    >({
        url: '/speakers',
        options,
    });

    return response
}