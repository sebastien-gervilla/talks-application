import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const create = async (body: TalksService.Models.Speaker.Create) => {
    const response = await Request.post<
        TalksService.Requests.Speaker.Post,
        TalksService.Responses.Speaker.Post
    >({
        url: '/speakers',
        body,
    });

    return response
}