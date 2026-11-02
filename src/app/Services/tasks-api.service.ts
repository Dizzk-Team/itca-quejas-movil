import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Task {
  id: number;
  title: string;
  descripcion: string;
  responsable: string;
  created_at: string;
  updated_at: string;
}

export class ApiError extends Error {
  constructor(public status: number) {
    super(`Error HTTP ${status}`);
  }
}

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private readonly tokenKey = 'task_api_token';

  get isAuthenticated(): boolean {
    return Boolean(sessionStorage.getItem(this.tokenKey));
  }

  async login(email: string, password: string): Promise<void> {
    const result = await this.request<{ token: string }>('/login', 'POST', { email, password });
    if (!result?.token) throw new Error('La API no devolvió un token.');
    sessionStorage.setItem(this.tokenKey, result.token);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  list(): Promise<Task[]> {
    return this.request<Task[]>('/tasks', 'GET');
  }

  private async request<T>(path: string, method: string, body?: object): Promise<T> {
    const token = sessionStorage.getItem(this.tokenKey);
    const response = await fetch(`${environment.apiUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token && path !== '/login' ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      if (response.status === 401 && path !== '/login') this.logout();
      throw new ApiError(response.status);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
