import axios, { AxiosInstance } from "axios";
import { LoginRequest } from "../utils/request/loginRequest";
import { RegisterRequest } from "../utils/request/registerRequest";
import { DeadlineRequest } from "@/utils/request/deadlineRequest";

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

            // Store tokens
            localStorage.setItem("accessToken", result1.data.access_token);
            localStorage.setItem("refreshToken", result1.data.refresh_token);

            // Store student_id
            if (result1.data.student_id) {
                localStorage.setItem("student_id", result1.data.student_id); // Store student_id for later use
            }

            return result1.data;
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            throw error;
        }
    }


    async register(registerRequest: RegisterRequest) {
        try {
            const response = await this.axiosObject.post("/auth/register", {
                name: registerRequest.name,
                email: registerRequest.email,
                password: registerRequest.password,
                student_id: registerRequest.student_id,
            });
            console.log("Server response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            throw error;
        }
    }

    async createDeadline(deadlineRequest: DeadlineRequest) {
        try {
            const response = await this.axiosObject.post("/deadline/create", deadlineRequest);
            console.log("Deadline created successfully:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Failed to create deadline:", error.response?.data || error.message);
            throw error;
        }
    }

    async updateDeadlineAlert(deadlineId: string, isActive: boolean) {
        try {
            const response = await this.axiosObject.patch(`/deadline/${deadlineId}`, { isActive });
            console.log("Deadline alert updated successfully:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Failed to update deadline alert:", error.response?.data || error.message);
            throw error;
        }
    }

    async findUserById (user_id: number) {
        try {
            const response = await this.axiosObject.get(`/user/${user_id}`);
            console.log("Find user successfully:", response.data);
            return response.data;
        } catch (error: any) {
            console.log("Failed to find user:", error.response?.data || error.message);
            throw error;
        }
    }

    async getTemplateBySchedulerId (schedulerId: number) {
        try {
            const response = await  this.axiosObject.get(`/scheduleTemplate/${schedulerId}`);
            console.log("Get template successfully: ", response.data);
            return response.data;
        } catch (error: any) {
            console.log("Failed to get template: ", error.response?.data || error.message);
            throw error;
        }
    }




}

export default new Api();
