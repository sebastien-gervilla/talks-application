import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const getCurrentConferences = async (controller?: AbortController) => {

    const options = controller ? {
        signal: controller.signal
    } : undefined;

    const response = await Request.get<
        TalksService.Requests.User.GetCurrentConferences,
        TalksService.Responses.User.GetCurrentConferences
    >({
        url: '/users/current/conferences',
        options,
    });

    return response
}