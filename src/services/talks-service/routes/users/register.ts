import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const register = async (body: TalksService.Requests.User.Register['body']) => {

    const response = await Request.post<
        TalksService.Requests.User.Register,
        TalksService.Responses.User.Register
    >({
        url: '/users/register',
        body,
    });

    return response
}