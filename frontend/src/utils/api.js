const API_BASE = '/api'

/**
 * Construye los headers de la request.
 * Si se pasa token, agrega Authorization: Bearer.
 */
function buildHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = 'Bearer ' + token
  return headers
}

/**
 * Procesa la respuesta:
 * - Si es 401, hace auto-logout y lanza error.
 * - Si !res.ok, intenta parsear el body de error del backend.
 * - Si ok, retorna el JSON parseado.
 */
async function handleResponse(res) {
  if (res.status === 401) {
    throw new Error('Sesión expirada. Por favor iniciá sesión de nuevo.')
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error?.message || data.message || 'Error en la solicitud')
  }

  return data
}

export const api = {
  get(path) {
    return fetch(API_BASE + path).then(handleResponse)
  },

  post(path, body, token) {
    return fetch(API_BASE + path, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(body),
    }).then(handleResponse)
  },

  put(path, body, token) {
    return fetch(API_BASE + path, {
      method: 'PUT',
      headers: buildHeaders(token),
      body: JSON.stringify(body),
    }).then(handleResponse)
  },

  delete(path, token) {
    return fetch(API_BASE + path, {
      method: 'DELETE',
      headers: buildHeaders(token),
    }).then(handleResponse)
  },
}
