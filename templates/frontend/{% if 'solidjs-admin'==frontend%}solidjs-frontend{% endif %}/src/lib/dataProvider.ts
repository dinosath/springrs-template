export interface ApiResponse<T> {
  data: T
  total?: number
}

export interface ListParams {
  page?: number
  perPage?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  filter?: Record<string, unknown>
}

const API_BASE = '/api'

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function createDataProvider<T extends { id: string | number }>(
  resource: string
) {
  return {
    getList: async (params: ListParams = {}): Promise<ApiResponse<T[]>> => {
      const searchParams = new URLSearchParams()
      if (params.page) searchParams.set('page', params.page.toString())
      if (params.perPage) searchParams.set('per_page', params.perPage.toString())
      if (params.sortField) searchParams.set('sort', params.sortField)
      if (params.sortOrder) searchParams.set('order', params.sortOrder)
      if (params.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value))
          }
        })
      }

      const query = searchParams.toString()
      const url = `/${resource}${query ? `?${query}` : ''}`
      return request<ApiResponse<T[]>>(url)
    },

    getOne: async (id: string | number): Promise<T> => {
      return request<T>(`/${resource}/${id}`)
    },

    create: async (data: Omit<T, 'id'>): Promise<T> => {
      return request<T>(`/${resource}`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: string | number, data: Partial<T>): Promise<T> => {
      return request<T>(`/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: string | number): Promise<void> => {
      await request(`/${resource}/${id}`, {
        method: 'DELETE',
      })
    },

    deleteMany: async (ids: (string | number)[]): Promise<void> => {
      await Promise.all(ids.map((id) => request(`/${resource}/${id}`, { method: 'DELETE' })))
    },
  }
}
