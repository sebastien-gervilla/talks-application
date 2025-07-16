import { TalksService } from "@/services/talks-service";

export const rooms = [
    TalksService.Models.Conference.Room.RoomA,
    TalksService.Models.Conference.Room.RoomB,
    TalksService.Models.Conference.Room.RoomC,
    TalksService.Models.Conference.Room.RoomD,
    TalksService.Models.Conference.Room.RoomE,
    TalksService.Models.Conference.Room.RoomF,
    TalksService.Models.Conference.Room.RoomG,
    TalksService.Models.Conference.Room.RoomH,
    TalksService.Models.Conference.Room.RoomI,
    TalksService.Models.Conference.Room.RoomJ,
];

export const CONFERENCES_DAYS = [
    new Date(Date.UTC(2025, 5, 18)),  // June 18, 2025
    new Date(Date.UTC(2025, 5, 19)),  // June 20, 2025
    new Date(Date.UTC(2025, 5, 20)),  // June 20, 2025
];

export const START_SLOT = 1;
export const MAX_SLOTS = 10;

export const START_SLOT_HOUR = 8;

export const ROOM_MAX_USERS = 25;

export const getTimeFromSlot = (slot: number) => {
    return START_SLOT_HOUR + slot - 1;
}