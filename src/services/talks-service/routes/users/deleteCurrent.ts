import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const deleteCurrent = async () => {

    const response = await Request.delete<
        TalksService.Requests.User.DeleteCurrent,
        TalksService.Responses.User.DeleteCurrent
    >({
        url: '/users/current/account'
    });

    return response
}