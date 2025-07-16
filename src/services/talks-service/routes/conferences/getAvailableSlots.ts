import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const getAvailableSlots = async (date: Date, controller?: AbortController) => {

    const options = controller ? {
        signal: controller.signal
    } : undefined;

    const response = await Request.get<
        TalksService.Requests.Conference.GetAvailableSlots,
        TalksService.Responses.Conference.GetAvailableSlots
    >({
        url: '/conferences/available-slots',
        options,
        query: {
            date,
        },
    });

    return response
}