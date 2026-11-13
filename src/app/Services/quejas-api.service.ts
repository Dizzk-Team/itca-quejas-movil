import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Reporte {
  id?: string;
  creador_id: string;
  creador?: {
    nombre_completo?: string;
  } | null;
  created_at?: string;
  fechas?: {
    reporte?: string;
  };
  categoria: string;
  ubicacion_exacta: string;
  descripcion: string;
  evidencias_url?: string[];
  confirmaciones_usuarios?: string[];
}

export interface Usuario {
  id: string;
  nombre_completo: string;
  correo_institucional: string;
  identificador_carnet: string;
  rol: string;
  departamento_o_carrera: string;
  estado_cuenta: boolean;
}

export type Quejas = Reporte;

interface ApiResponse<T> {
  status: string;
  data: T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public validationErrors: Record<string, string[]> = {},
    message = `Error HTTP ${status}`,
  ) {
    super(message);
  }
}

@Injectable({ providedIn: 'root' })
export class QuejasApiService {
  private readonly tokenKey = 'quejas_api_token';
  private readonly creatorIdKey = 'quejas_creator_id';

  get isAuthenticated(): boolean {
    return Boolean(sessionStorage.getItem(this.tokenKey) && this.creatorId);
  }

  get creatorId(): string | null {
    return sessionStorage.getItem(this.creatorIdKey);
  }

  async login(correo_institucional: string, password: string): Promise<void> {
    const result = await this.request<{
      access_token: string;
      creador_id: string;
    }>('/login', 'POST', { correo_institucional, password });
    if (!result?.access_token || !result.creador_id) {
      throw new Error('La API no devolvió los datos de autenticación.');
    }
    sessionStorage.setItem(this.tokenKey, result.access_token);
    sessionStorage.setItem(this.creatorIdKey, result.creador_id);
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.creatorIdKey);
  }

  async list(): Promise<Reporte[]> {
    const response = await this.request<ApiResponse<Reporte[]>>(
      '/reportes',
      'GET',
    );
    if (!Array.isArray(response.data)) {
      throw new Error('La API devolvió una lista de reportes inválida.');
    }

    return response.data;
  }

  // Obtiene los datos de la interfaz de usuario y los devuelve a perfil
  obtenerPerfilUsuario(): Promise<Usuario> {
    // Nota: Reemplaza '/perfil' si tu backend usa otra ruta (ej. '/me' o '/usuario/actual')
    return this.request<Usuario>('/perfil', 'GET');
  }

  async create(
    creador_id: string,
    categoria: string,
    ubicacion_exacta: string,
    descripcion: string,
    imagenObj?: File | Blob,
  ): Promise<Reporte> {
    const formData = new FormData();
    formData.append('creador_id', creador_id);
    formData.append('categoria', categoria);
    formData.append('ubicacion_exacta', ubicacion_exacta);
    formData.append('descripcion', descripcion);

    if (imagenObj) {
      formData.append('imagen', imagenObj);
    }

    const response = await this.request<ApiResponse<Reporte>>(
      '/reportes',
      'POST',
      formData,
    );
    return response.data;
  }

  async confirm(reportId: string, userId: string): Promise<Reporte> {
    const response = await this.request<ApiResponse<Reporte>>(
      `/reportes/${encodeURIComponent(reportId)}/confirmar`,
      'POST',
      { usuario_id: userId },
    );
    return response.data;
  }

  private async request<T>(
    path: string,
    method: string,
    body?: object | FormData, // Ahora acepta tanto JSON como FormData
  ): Promise<T> {
    const token = sessionStorage.getItem(this.tokenKey);

    const isFormData = body instanceof FormData;

    const response = await fetch(`${environment.apiUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(!isFormData && body ? { 'Content-Type': 'application/json' } : {}),
        ...(token && path !== '/login'
          ? { Authorization: `Bearer ${token}` }
          : {}),
      },
      ...(body
        ? { body: isFormData ? (body as FormData) : JSON.stringify(body) }
        : {}),
    });

    if (!response.ok) {
      if (response.status === 401 && path !== '/login') this.logout();
      const errorBody = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      throw new ApiError(response.status, errorBody.errors, errorBody.message);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }
}
