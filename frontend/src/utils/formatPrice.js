/**
 * Formatea un número como precio en colones costarricenses.
 * @param {number | string} value
 * @returns {string}  Ejemplo: "₡1.500"
 */
export function formatPrice(value) {
  return '₡' + Number(value).toLocaleString('es-CR')
}
