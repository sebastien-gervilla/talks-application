import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const join = async (id: number) => {
    const response = await Request.patch<
        TalksService.Requests.Conference.Join,
        TalksService.Responses.Conference.Join
    >({
        url: `/conferences/${id}/join`,
        options: {
            headers: {
                'Content-Type': 'text/plain',
            },
        },
    });

    return response
}