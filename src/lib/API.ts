import axios from "axios"
const API_URL =
  "https://alert-server-production-937d.up.railway.app/api/work-flow/"

export interface ApiWorkflow {
  UserName?: string
  WorkFlowId?: number
  WorkFlowName: string
  LastUpdated?: string
  CreatedAt?: string
}

export const fetchWorkflows = async (
  userId: number
): Promise<ApiWorkflow[]> => {
  try {
    const response = await axios.get(API_URL + "all", {
      headers: { UserId: userId },
    })
    console.log("response", response.data.result)
    return response.data.result
  } catch (error) {
    console.error("Error fetching workflows:", error)
    throw error
  }
}

export const addWorkflows = async (
  userId: number,
  workFlowName: string
): Promise<ApiWorkflow[]> => {
  try {
    const response = await axios.post(
      API_URL + "create",
      {
        userId: userId,
        WorkFlowName: workFlowName,
      },
      {
        headers: { UserId: userId },
      }
    )
    console.log("response.data", response.data)
    return response.data
  } catch (error) {
    console.error("Error adding workflows:", error)
    throw error
  }
}
export const getUserProfile = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}
export const updateUserProfile = async (userId: number, profileData: { name: string; email: string }) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, profileData)
    return response.data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}
export const getNotifications = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { UserId: userId },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching notifications:", error)
    throw error
  }
}
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`)
    return response.data
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}
export const createSchedule = async (userId: number, scheduleData: { title: string; date: string }) => {
  try {
    const response = await axios.post(`${API_URL}/schedules`, {
      userId,
      ...scheduleData,
    })
    return response.data
  } catch (error) {
    console.error("Error creating schedule:", error)
    throw error
  }
}
export const getSchedules = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/schedules`, {
      headers: { UserId: userId },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching schedules:", error)
    throw error
  }
}
export const deleteSchedule = async (scheduleId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/schedules/${scheduleId}`)
    return response.data
  } catch (error) {
    console.error("Error deleting schedule:", error)
    throw error
  }
}
export const updateSchedule = async (scheduleId: number, scheduleData: { title: string; date: string }) => {
  try {
    const response = await axios.put(`${API_URL}/schedules/${scheduleId}`, scheduleData)
    return response.data
  } catch (error) {
    console.error("Error updating schedule:", error)
    throw error
  }
}
