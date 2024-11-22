import axios, { AxiosInstance } from "axios";
import { RegisterRequest } from "./request/registerRequest";
// import { DeadlineRequest } from "./request/deadlineRequest"; // Removed the extra "." at the end

export class Api {
    private axiosObject: AxiosInstance;

    constructor() {
        this.axiosObject = axios.create({
            baseURL: "http://localhost:3000/api",
            withCredentials: true,
        });
    }

    getAxiosObject() {
        return this.axiosObject;
    }

    // Login method
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

    // Register method
    async register(registerRequest: RegisterRequest) {
        try {
            const { name, email, password, student_id } = registerRequest;
            console.log(name, email, password, student_id);

            const response2 = await this.axiosObject.post("/auth/register", {
                name,
                email,
                password,
                student_id,
            });

            console.log(response2.data);
            return response2.data;
        } catch (error: any) {
            console.error("Registration failed:", error.response2?.data || error.message);
            throw error;
        }
    }
    //
    // // Create deadline method
    // async createDeadline(deadlineData: DeadlineRequest) {
    //     try {
    //         const response3 = await this.axiosObject.post("/deadline/create", deadlineData);
    //         console.log("Deadline created successfully:", response3.data);
    //         return response3.data;
    //     } catch (error: any) {
    //         console.error("Error creating deadline:", error.response3?.data || error.message);
    //         throw error;
    //     }
    // }
}
