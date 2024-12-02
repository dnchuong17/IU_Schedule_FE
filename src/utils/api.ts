import axios, { AxiosInstance } from "axios";
import { LoginRequest } from "../utils/request/loginRequest";
import { RegisterRequest } from "../utils/request/registerRequest";

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

    async login(loginRequest: LoginRequest) {
        const { email, password } = loginRequest;
        try {
            const result1 = await this.axiosObject.post("/auth/login", {
                email,
                password,
            });
            localStorage.setItem("accessToken", result1.data.access_token);
            localStorage.setItem("refreshToken", result1.data.refresh_token);
            return result1.data;
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    }

    async register(registerRequest: RegisterRequest) {
        try {
            const result2 = await this.axiosObject.post("/auth/register", registerRequest);
            console.log("Server response:", result2.data);
            return result2.data;
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw error; // Re-throw error for higher-level handling
        }
    }

    // // Create deadline method
    // async createDeadline(deadlineData: any) { // Replace `any` with the correct type if available (e.g., DeadlineRequest)
    //     try {
    //         const response3 = await this.axiosObject.post("/deadline/create", deadlineData);
    //         console.log("Deadline created successfully:", response3.data);
    //         return response3.data;
    //     } catch (error: any) {
    //         console.error("Error creating deadline:", error.response?.data || error.message);
    //         throw error;
    //     }
    // }
}

