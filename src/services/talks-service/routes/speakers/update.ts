import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const update = async (id: number, body: TalksService.Models.Speaker.Update) => {
    const response = await Request.put<
        TalksService.Requests.Speaker.Put,
        TalksService.Responses.Speaker.Put
    >({
        url: `/speakers/${id}`,
        body,
    });

    return response
}