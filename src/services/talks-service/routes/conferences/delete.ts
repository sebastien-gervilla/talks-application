import { Request } from "@/services/talks-service/helpers/request";
import { TalksService } from "@/services/talks-service";

export const _delete = async (id: number) => {
    const response = await Request.delete<
        TalksService.Requests.Conference.Delete,
        TalksService.Responses.Conference.Delete
    >({
        url: `/conferences/${id}`,
        options: {
            headers: {
                'Content-Type': 'text/plain',
            },
        },
    });

    return response
}