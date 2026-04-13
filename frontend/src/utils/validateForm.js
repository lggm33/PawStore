/**
 * Retorna true si algún campo del objeto es vacío, null o undefined.
 * @param {Record<string, unknown>} obj
 * @returns {boolean}
 */
export function hasEmptyFields(obj) {
  return Object.values(obj).some(
    (val) => val === '' || val === null || val === undefined
  )
}
