import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const create = async (body: TalksService.Models.Conference.Create) => {
    const response = await Request.post<
        TalksService.Requests.Conference.Post,
        TalksService.Responses.Conference.Post
    >({
        url: '/conferences',
        body,
    });

    return response
}