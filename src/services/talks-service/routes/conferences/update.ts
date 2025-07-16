import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const update = async (id: number, body: TalksService.Models.Conference.Update) => {
    const response = await Request.put<
        TalksService.Requests.Conference.Put,
        TalksService.Responses.Conference.Put
    >({
        url: `/conferences/${id}`,
        body,
    });

    return response
}