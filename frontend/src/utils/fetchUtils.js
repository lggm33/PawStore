export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export async function handleResponse(response) {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `HTTP Error ${response.status}`);
  }
  return response.json();
}
