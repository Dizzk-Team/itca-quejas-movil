import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Quejas {
  creador_id: number;
  categoria: string;
  ubicacion_exacta: string;
  descripcion: string;
  evidencias_url: string;
}

export class ApiError extends Error {
  constructor(public status: number) {
    super(`Error HTTP ${status}`);
  }
}

@Injectable({ providedIn: 'root' })
export class QuejasApiService {
  private readonly tokenKey = 'quejas_api_token';

  get isAuthenticated(): boolean {
    return Boolean(sessionStorage.getItem(this.tokenKey));
  }

  // Cambio de la variable 'token'por 'access_token', ya que la api guarda el token en esa variable
  async login(correo_institucional: string, password: string): Promise<void> {
    const result = await this.request<{ access_token: string }>(
      '/login',
      'POST',
      {
        correo_institucional,
        password,
      },
    );
    if (!result?.access_token) throw new Error('La API no devolvió un token.');
    sessionStorage.setItem(this.tokenKey, result.access_token);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  list(): Promise<Quejas[]> {
    return this.request<Quejas[]>('/reportes', 'GET');
  }

  create(categoria: string, ubicacion_exacta: string, descripcion: string, evidencias_url:string): Promise<Quejas> {
    return this.request<Quejas>('/reportes', 'POST', {categoria, ubicacion_exacta, descripcion, evidencias_url});
  }

  private async request<T>(
    path: string,
    method: string,
    body?: object,
  ): Promise<T> {
    const token = sessionStorage.getItem(this.tokenKey);
    const response = await fetch(`${environment.apiUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token && path !== '/login'
          ? { Authorization: `Bearer ${token}` }
          : {}),
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
