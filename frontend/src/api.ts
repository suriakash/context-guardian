const API_BASE_URL = 'http://localhost:5000/api';

// Define the API interface
export interface APIResponse {
  success: boolean;
  [key: string]: any;
}

export const api = {
  // Get all meetings
  getMeetings: async (): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/meetings`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  },

  // Get context for specific meeting
  getMeetingContext: async (meetingId: string): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/${meetingId}/context`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching meeting context:', error);
      throw error;
    }
  },

  // Get enhanced context with AI
  getEnhancedContext: async (meetingId: string): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting/${meetingId}/context/enhanced`);
      return await response.json();
    } catch (error) {
      console.error('Error getting enhanced context:', error);
      throw error;
    }
  },

  // Mock Google Calendar events
  getMockGoogleEvents: async (count: number = 8): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/mock/google-events?count=${count}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching mock events:', error);
      throw error;
    }
  },

  // Get AI summary
  getAISummary: async (title: string, category: string = 'team'): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/mock/ai-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, category }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error getting AI summary:', error);
      throw error;
    }
  },

  // Get AI tip
  getAITip: async (): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/tip`);
      return await response.json();
    } catch (error) {
      console.error('Error getting AI tip:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<APIResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error in health check:', error);
      throw error;
    }
  }
};