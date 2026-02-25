import data from '../assets/data.json'

export function searchProductById(id) {
  return data.find(product => product.id === id)

}

export function getAllProducts() {
  return data
}