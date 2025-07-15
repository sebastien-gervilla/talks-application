import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const logout = async () => {

    const response = await Request.post<
        TalksService.Requests.User.Logout,
        TalksService.Responses.User.Logout
    >({
        url: '/users/logout',
        options: {
            headers: {
                'Content-Type': 'text/plain',
            },
        },
    });

    return response
}