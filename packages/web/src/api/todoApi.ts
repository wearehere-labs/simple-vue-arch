import axios from 'axios';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoDto {
  title: string;
  description?: string;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const todoApi = {
  async getAll(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  async getById(id: string): Promise<Todo> {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  async create(dto: CreateTodoDto): Promise<Todo> {
    const response = await api.post<Todo>('/todos', dto);
    return response.data;
  },

  async update(id: string, dto: UpdateTodoDto): Promise<Todo> {
    const response = await api.put<Todo>(`/todos/${id}`, dto);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  }
};
