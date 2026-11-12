export type Category = {
  slug: string
  name: string
}

export type Product = {
  id: number
  title: string
  price: number
  thumbnail: string
  category: string
  brand?: string
}

export type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}
