import axios, { AxiosInstance } from "axios";
import { RegisterRequest } from "./request/registerRequest";

export class Api {
    private axiosObject: AxiosInstance;

    constructor() {
        this.axiosObject = axios.create({
            baseURL: "http://localhost:3000",
            withCredentials: true, // Cho phép gửi cookie và thông tin xác thực khác trong các yêu cầu
        });
    }

    getAxiosObject() {
        return this.axiosObject;
    }

    async login(loginRequest: { username: string; password: string }) {
        const { username, password } = loginRequest;
        try {
            const response = await this.axiosObject.post("/auth/login", {
                username,
                password,
            });
            localStorage.setItem("accessToken", response.data.access_token);
            localStorage.setItem("refreshToken", response.data.refresh_token);
            return response.data;
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    }

    async register(registerRequest: RegisterRequest) {
        try {
            const { name, username, password, student_id } = registerRequest;
            console.log(name, username, password, student_id);

            const response = await this.axiosObject.post("/auth/register", {
                name,
                username,
                password,
                student_id,
            });

            console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw error;
        }
    }
}
