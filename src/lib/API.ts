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
