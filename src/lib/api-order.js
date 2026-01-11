// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.details || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Order API functions
const orderAPI = {
  // Create a new order
  create: async (orderData) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get all orders (optionally filtered)
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/orders?${queryParams}` : '/orders';
    return fetchAPI(endpoint);
  },

  // Get a single order by ID
  getById: async (orderId) => {
    return fetchAPI(`/orders/${orderId}`);
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    return fetchAPI(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete an order
  delete: async (orderId) => {
    return fetchAPI(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },
};

export { orderAPI };
