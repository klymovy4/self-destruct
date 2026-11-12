import type { Product } from '../../types/product'
import classes from '../search/Search.module.scss'

type ProductCardPropss = {
  product: Product
}

const ProductCard = ({ product }: ProductCardPropss) => {
  return (
    <article>
      <h3>Title: {product.title}</h3>

      <img loading='lazy' src={product.thumbnail} alt={product.title} className={classes.image} />

      <h4>Details:</h4>
      {product.brand && <p>Brand: {product.brand}</p>}
      <p>Category: {product.category}</p>
      <p>Price: {product.price}$</p>
    </article>
  )
}

export default ProductCard
