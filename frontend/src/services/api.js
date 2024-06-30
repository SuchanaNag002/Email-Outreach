import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

// Handle the API response, throwing an error if the response is not OK
async function handleResponse(response) {
  try {
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error parsing response data:", error);
    throw new Error("An error occurred");
  }
}

// Create a new flowchart
export async function createFlowchart(flowchartData) {
  console.log("Flowchart data being sent: ", flowchartData);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/flowcharts/`,
      flowchartData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error creating flowchart:", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

// Get a specific flowchart by ID
export async function getFlowchart(flowchartId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/flowcharts/${flowchartId}`
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching flowchart:", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

// Update a specific flowchart by ID
export async function updateFlowchart(flowchartId, flowchartData) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/flowcharts/${flowchartId}`,
      flowchartData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error updating flowchart:", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

// Delete a specific flowchart by ID
export async function deleteFlowchart(flowchartId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/flowcharts/${flowchartId}`
    );
    return handleResponse(response);
  } catch (error) {
    console.error("Error deleting flowchart:", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}

// Get all flowcharts
export async function getFlowcharts() {
  try {
    const response = await axios.get(`${API_BASE_URL}/flowcharts`);
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching flowcharts:", error);
    throw new Error(error.response?.data?.message || "An error occurred");
  }
}
