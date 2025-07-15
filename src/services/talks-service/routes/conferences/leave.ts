import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const leave = async (id: number) => {
    const response = await Request.patch<
        TalksService.Requests.Conference.Leave,
        TalksService.Responses.Conference.Leave
    >({
        url: `/conferences/${id}/leave`,
        options: {
            headers: {
                'Content-Type': 'text/plain',
            },
        },
    });

    return response
}