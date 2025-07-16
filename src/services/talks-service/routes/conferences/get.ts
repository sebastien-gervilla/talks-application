import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const get = async (query: TalksService.Models.Conference.GetQuery, controller?: AbortController) => {

    const options = controller ? {
        signal: controller.signal
    } : undefined;

    const response = await Request.get<
        TalksService.Requests.Conference.Get,
        TalksService.Responses.Conference.Get
    >({
        url: '/conferences',
        options,
        query,
    });

    return response
}