import api from "./axios";

// Get all orders for a user
export const getUserOrders = async (userId) => {
  try {
    // Try main API first
    const response = await api.get(`/api/orders/user/${userId}`);
    return response;
  } catch (error) {
    console.log("Main API failed, trying demo API:", error.message);
    try {
      // Fallback to demo API
      const demoResponse = await api.get(`/api/demo/orders/user/${userId}`);
      return demoResponse;
    } catch (demoError) {
      console.error("Both APIs failed:", demoError);
      throw demoError;
    }
  }
};

// Get order details by ID
export const getOrderById = async (orderId) => {
  try {
    // Try main API first
    const response = await api.get(`/api/orders/${orderId}`);
    return response;
  } catch (error) {
    console.log("Main API failed, trying demo API:", error.message);
    try {
      // Fallback to demo API
      const demoResponse = await api.get(`/api/demo/orders/${orderId}`);
      return demoResponse;
    } catch (demoError) {
      console.error("Both APIs failed:", demoError);
      throw demoError;
    }
  }
};

// Create a new order (called after successful payment)
export const createOrder = async (orderData) => {
  try {
    // Try main API first
    const response = await api.post("/api/orders/create", orderData);
    return response;
  } catch (error) {
    console.log("Main API failed, trying demo API:", error.message);
    try {
      // Fallback to demo API
      const demoResponse = await api.post("/api/demo/orders/create", orderData);
      return demoResponse;
    } catch (demoError) {
      console.error("Both APIs failed:", demoError);
      throw demoError;
    }
  }
};
