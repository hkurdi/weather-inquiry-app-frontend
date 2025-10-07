import axios from 'axios';
import type {
  ChatRequest,
  ChatResponse,
  UploadResponse,
  FilesResponse,
  StatusResponse,
  DeleteResponse,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat', request);
    return response.data;
  },

  getExamples: async () => {
    const response = await api.get('/api/chat/examples');
    return response.data;
  },
};

// Admin API
export const adminApi = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${ADMIN_PASSWORD}`,
      },
    });
    return response.data;
  },

  getFiles: async (): Promise<FilesResponse> => {
    const response = await api.get<FilesResponse>('/admin/files', {
      headers: {
        Authorization: `Bearer ${ADMIN_PASSWORD}`,
      },
    });
    return response.data;
  },

  getStatus: async (): Promise<StatusResponse> => {
    const response = await api.get<StatusResponse>('/admin/status', {
      headers: {
        Authorization: `Bearer ${ADMIN_PASSWORD}`,
      },
    });
    return response.data;
  },

  deleteFile: async (filename: string): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>(`/admin/files/${filename}`, {
      headers: {
        Authorization: `Bearer ${ADMIN_PASSWORD}`,
      },
    });
    return response.data;
  },
};

// Health API
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};