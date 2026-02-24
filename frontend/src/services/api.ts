/**
 * API Service Layer
 * Handles all communication with the FastAPI backend
 */

const API_BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || '';

// Token management
const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// ==================== AUTHENTICATION ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
  };
}

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiCall<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setAuthToken(response.access_token);
    return response;
  },

  logout: () => {
    clearAuthToken();
    sessionStorage.removeItem('admin_authenticated');
  },

  verifyToken: async () => {
    return apiCall('/auth/verify');
  },
};

// ==================== PRODUCTS ====================

export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  product_type: string;
  image_url?: string;
  file_url?: string;
  preview_url?: string;
  features?: string[];
  requirements?: string[];
  tags?: string[];
  is_active: boolean;
  is_featured: boolean;
  slug: string;
  display_order?: number;
  download_count: number;
  rating?: number;
  review_count: number;
  gallery_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  short_description?: string;
  price: number;
  original_price?: number;
  product_type: string;
  image_url?: string;
  file_url?: string;
  preview_url?: string;
  features?: string[];
  requirements?: string[];
  tags?: string[];
  is_active?: boolean;
  is_featured?: boolean;
  slug: string;
  display_order?: number;
}

export const productsAPI = {
  getAll: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : '';
    return apiCall<Product[]>(`/products${params}`);
  },

  getById: (id: string) => {
    return apiCall<Product>(`/products/${id}`);
  },

  create: (product: ProductCreate) => {
    return apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  update: (id: string, product: Partial<ProductCreate>) => {
    return apiCall<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  delete: (id: string) => {
    return apiCall(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CERTIFICATIONS ====================

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface CertificationCreate {
  name: string;
  issuer: string;
  credential_id?: string;
  credential_url?: string;
  issue_date?: string;
  expiry_date?: string;
  image_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export const certificationsAPI = {
  getAll: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : '';
    return apiCall<Certification[]>(`/certifications${params}`);
  },

  getById: (id: string) => {
    return apiCall<Certification>(`/certifications/${id}`);
  },

  create: (certification: CertificationCreate) => {
    return apiCall<Certification>('/certifications', {
      method: 'POST',
      body: JSON.stringify(certification),
    });
  },

  update: (id: string, certification: Partial<CertificationCreate>) => {
    return apiCall<Certification>(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(certification),
    });
  },

  delete: (id: string) => {
    return apiCall(`/certifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== CONTACT MESSAGES ====================

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  subject?: string;
  is_read: boolean;
  replied_at?: string;
  created_at: string;
}

export interface ContactMessageCreate {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  subject?: string;
}

export const contactAPI = {
  getAll: () => {
    return apiCall<ContactMessage[]>('/contact-messages');
  },

  create: (message: ContactMessageCreate) => {
    return apiCall<ContactMessage>('/contact-messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  delete: (id: string) => {
    return apiCall(`/contact-messages/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== PROFILE ====================

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  profile_image_url?: string;
  resume_url?: string;
  experience_years: number;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  name?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  profile_image_url?: string;
  resume_url?: string;
  experience_years?: number;
}

export const profileAPI = {
  get: () => {
    return apiCall<Profile>('/profile');
  },

  update: (profile: ProfileUpdate) => {
    return apiCall<Profile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },
};

// ==================== CONTENT SECTIONS ====================

export interface ContentSection {
  id?: string;
  section_name: string;
  content: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export const contentAPI = {
  get: (sectionName: string) => {
    return apiCall<ContentSection>(`/content/${sectionName}`);
  },

  update: (sectionName: string, content: Record<string, any>) => {
    return apiCall<ContentSection>(`/content/${sectionName}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },
};

// ==================== FILE UPLOAD ====================

export interface UploadResponse {
  filename: string;
  url: string;
  original_filename: string;
}

export const uploadAPI = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    return response.json();
  },
};

// Health check
export const healthCheck = () => {
  return apiCall('/health');
};
