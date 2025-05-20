import { auth } from '@/firebase/auth'; // Assuming this is your initialized Firebase auth instance

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Record<string, unknown>; 
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const user = auth.currentUser;
  let token: string | null = null;

  if (user) {
    try {
      token = await user.getIdToken();
    } catch (error) {
      console.error("Error getting ID token:", error);
      throw new Error("Failed to authenticate request.");
    }
  }

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const { body, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'API request failed with no JSON response' }));
    console.error("API Error:", errorData);
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  // If response is not supposed to have content (e.g. 204 No Content)
  if (response.status === 204) {
      return undefined as T; // Or handle as appropriate for your app
  }

  return response.json() as Promise<T>;
}

export default apiClient;