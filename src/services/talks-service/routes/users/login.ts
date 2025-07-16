import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const login = async (body: TalksService.Requests.User.Login['body']) => {

    const response = await Request.post<
        TalksService.Requests.User.Login,
        TalksService.Responses.User.Login
    >({
        url: '/users/login',
        body,
    });

    return response
}