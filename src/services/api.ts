const API_BASE_URL = 'http://127.0.0.1:5000/api';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: { username: string; email: string; password: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User endpoints
  async getUser(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateProfile(profileData: {
    bio?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    profilePicUrl?: string;
  }) {
    return this.request('/users/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async followUser(userId: string) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string) {
    return this.request(`/users/${userId}/unfollow`, {
      method: 'POST',
    });
  }

  async getFollowers(userId: string) {
    return this.request<any[]>(`/users/${userId}/followers`);
  }

  async getFollowing(userId: string) {
    return this.request<any[]>(`/users/${userId}/following`);
  }

  // Post endpoints
  async createPost(postData: {
    content: string;
    imageUrl?: string;
    tags?: string[];
  }) {
    return this.request('/posts/', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getPosts() {
    return this.request<any[]>('/posts/');
  }

  async likePost(postId: string) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async unlikePost(postId: string) {
    return this.request(`/posts/${postId}/unlike`, {
      method: 'POST',
    });
  }

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  // Project endpoints
  async createProject(projectData: {
    title: string;
    description: string;
    githubLink: string;
    imageUrl?: string;
    tags?: string[];
  }) {
    return this.request('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProjects() {
    return this.request<any[]>('/projects/');
  }

  async getUserProjects(userId: string) {
    return this.request<any[]>(`/projects/user/${userId}`);
  }
}

export const apiService = new ApiService();