import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const _delete = async (id: number) => {
    const response = await Request.delete<
        TalksService.Requests.Speaker.Delete,
        TalksService.Responses.Speaker.Delete
    >({
        url: `/speakers/${id}`,
        options: {
            headers: {
                'Content-Type': 'text/plain',
            },
        },
    });

    return response
}