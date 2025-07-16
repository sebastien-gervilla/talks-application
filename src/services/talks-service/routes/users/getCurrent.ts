import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const getCurrent = async () => {

    const response = await Request.get<
        TalksService.Requests.User.GetCurrent,
        TalksService.Responses.User.GetCurrent
    >({
        url: '/users/current'
    });

    return response
}