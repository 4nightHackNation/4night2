/**
 * API Configuration
 * Centralna konfiguracja dla wszystkich połączeń API
 * 
 * Użycie w komponentach:
 * import { API_URL, API_ENDPOINTS, apiPost, apiGet } from '@/config/api';
 * 
 * // GET
 * const acts = await apiGet(API_ENDPOINTS.ACTS.LIST);
 * 
 * // POST
 * const newAct = await apiPost(API_ENDPOINTS.ACTS.CREATE, actData);
 * 
 * // PUT
 * const updated = await apiPut(API_ENDPOINTS.ACTS.UPDATE('id'), actData);
 * 
 * // DELETE
 * await apiDelete(API_ENDPOINTS.ACTS.DELETE('id'));
 */

// Główny URL API - tutaj należy wkleić adres serwera API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7126/api';

// Struktura endpointów dla łatwego dostępu
export const API_ENDPOINTS = {
  // Akty Prawne - ActsController
  ACTS: {
    LIST: '/acts',
    DETAIL: (id: string) => `/acts/${id}`,
    DETAIL_WITH_DETAILS: (id: string) => `/acts/${id}/with-details`,
    CREATE: '/acts',
    UPDATE: (id: string) => `/acts/${id}`,
    DELETE: (id: string) => `/acts/${id}`,
  },

  // Wersje Aktów - ActVersionsController
  VERSIONS: {
    CREATE: (actId: string) => `/acts/${actId}/versions`,
    DETAIL: (actId: string, versionId: string) => `/acts/${actId}/versions/${versionId}`,
    UPDATE: (actId: string, versionId: string) => `/acts/${actId}/versions/${versionId}`,
    DELETE: (actId: string, versionId: string) => `/acts/${actId}/versions/${versionId}`,
    UPLOAD_PDF: (actId: string, versionId: string) => `/acts/${actId}/versions/${versionId}/file`,
  },

  // Wyjaśnienia Aktów - ActExplanationController
  EXPLANATIONS: {
    GENERATE: (actId: string) => `/acts/${actId}/explanation`,
  },

  // Głosowania po Czytaniach - ReadingVotesController
  READING_VOTES: {
    CREATE: (actId: string) => `/acts/${actId}/reading-votes`,
    DETAIL: (actId: string, voteId: string) => `/acts/${actId}/reading-votes/${voteId}`,
    UPDATE: (actId: string, voteId: string) => `/acts/${actId}/reading-votes/${voteId}`,
    DELETE: (actId: string, voteId: string) => `/acts/${actId}/reading-votes/${voteId}`,
  },

  // Etapy Aktów - ActStagesController
  STAGES: {
    CREATE: (actId: string) => `/acts/${actId}/stages`,
    UPDATE: (actId: string, stageId: string) => `/acts/${actId}/stages/${stageId}`,
    DELETE: (actId: string, stageId: string) => `/acts/${actId}/stages/${stageId}`,
  },

  // Tagi - TagsController
  TAGS: {
    LIST: '/tags',
    DETAIL: (id: number) => `/tags/id?id=${id}`,
    CREATE: '/tags',
    UPDATE: (id: number) => `/tags/${id}`,
    DELETE: (id: number) => `/tags/${id}`,
  },
} as const;

/**
 * Helper do tworzenia pełnego URL endpointa
 * @param endpoint ścieżka endpointa
 * @returns pełny URL do API
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_URL}${endpoint}`;
};

/**
 * Helper do fetch z domyślnymi headerami
 * @param endpoint ścieżka endpointa
 * @param options dodatkowe opcje fetch
 * @returns Promise z response'em
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Dodaj token jeśli istnieje w localStorage
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  return fetch(getApiUrl(endpoint), {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
};

/**
 * Helper do POST requestów
 */
export const apiPost = async (
  endpoint: string,
  data: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  return apiFetch(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Helper do PUT requestów
 */
export const apiPut = async (
  endpoint: string,
  data: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  return apiFetch(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Helper do DELETE requestów
 */
export const apiDelete = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return apiFetch(endpoint, {
    ...options,
    method: 'DELETE',
  });
};

/**
 * Helper do GET requestów
 */
export const apiGet = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  return apiFetch(endpoint, {
    ...options,
    method: 'GET',
  });
};

/**
 * Typy odpowiedzi API
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
}
