import axios, { AxiosInstance } from "axios";
import { LoginRequest } from "../utils/request/loginRequest";
import { RegisterRequest } from "../utils/request/registerRequest";
import { DeadlineRequest } from "@/utils/request/deadlineRequest";
import { scheduleRequest } from "@/utils/request/scheduleRequest";

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
    const {email, password} = loginRequest;
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
        console.log("Student ID ne:", result1.data.student_id);
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
      console.error(
          "Registration failed:",
          error.response?.data || error.message
      );
      throw error; // Re-throw error for higher-level handling
    }
  }

  async createDeadline(deadlineRequest: DeadlineRequest) {
    try {
      const response = await this.axiosObject.post(
          "/deadline/create",
          deadlineRequest
      );
      console.log("Deadline created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
          "Failed to create deadline:",
          error.response?.data || error.message
      );
      throw error;
    }
  }

  async updateDeadlineAlert(deadlineId: string, isActive: boolean) {
    try {
      const response = await this.axiosObject.patch(`/deadline/${deadlineId}`, {
        isActive,
      });
      console.log("Deadline alert updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
          "Failed to update deadline alert:",
          error.response?.data || error.message
      );
      throw error;
    }
  }

  async getTemplateId(user_id: number) {
    try {
      const response = await this.axiosObject.get(
          `/scheduleTemplate/templateIds/${user_id}`
      );
      console.log("Get template Id successfully: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log(
          "Failed to get template Id: ",
          error.response?.data || error.message
      );
      throw error;
    }
  }

  async getTemplateBySchedulerId(schedulerId: number) {
    try {
      const response = await this.axiosObject.get(
          `/scheduleTemplate/${schedulerId}`
      );
      console.log("Get template successfully: ", response.data);
      return response.data;
    } catch (error: any) {
      console.log(
          "Failed to get template: ",
          error.response?.data || error.message
      );
      throw error;
    }
  }

  async createNewSchedule(scheduleRequest: scheduleRequest) {
    try {
      const studentId = localStorage.getItem("student_id");
      console.log("Retrieved studentId:", studentId); // Verify retrieval
      if (!studentId) {
        console.error("Student ID is missing. Please login again.");
        throw new Error("Student ID is missing.");
      }
      const response = await this.axiosObject.post(
          "/scheduleTemplate/createSchedule",
          scheduleRequest // Send directly
      );
      console.log("List of Courses:", scheduleRequest.listOfCourses); // Debugging line
      console.log("Schedule created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
          "Create Schedule failed:",
          error.response?.data || error.message
      );
      throw error;
    }
  }

  async updateNote(content: string, courseValueId: number) {
    try {
      const response = await this.axiosObject.patch("/note/update", {
        content, courseValueId,
      });
      console.log("Update note successfully: ", response.data);
      return response.data;
    } catch (error) {
      console.log("Error updating note: ", error);
      throw error;
    }
  }


  async createNote(content: string, courseValueId: number) {
    try {
      const response = await this.axiosObject.post('/note/create', {
        content,
        courseValueId
      });
      console.log("Create note successfully: ", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }

  async getDeadline(courseValueId: number) {
    try {
      const response = await this.axiosObject.get(`/deadline/by-course-value/${courseValueId}`);
      console.log("Get deadline successfully: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching deadlines: ", error);
      throw error;
    }
  }

}


export default new Api();
