import { Models } from "@/services/talks-service/interfaces";
import { HttpRequest } from "@/services/talks-service/interfaces/http-interface";

export interface GetCurrent extends HttpRequest { }

export interface Register extends HttpRequest {
    body: Models.User.Register;
}

export interface Login extends HttpRequest {
    body: Models.User.Login;
}

export interface Logout extends HttpRequest { }