import { useParams } from 'react-router'
import { useGetProductByIdQuery } from '../../../api/productsApi'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { skipToken } from '@reduxjs/toolkit/query/react'
import classes from './ProductDetails.module.scss'
import StarRating from '../../starRating/StarRating'

const ProductDetails = () => {
  const { productId } = useParams()
  const id = Number(productId)
  const isValidId = Number.isInteger(id) && id > 0

  const { currentData, isFetching, error } = useGetProductByIdQuery(isValidId ? id : skipToken)

  const errorMessage = getErrorMessage(error)

  if (!isValidId) return <p>Product not found</p>
  if (isFetching && !currentData) return <p>Loading...</p>
  if (errorMessage) return <p>{errorMessage}</p>
  if (!currentData) return null

  return (
    <article className={classes.detailCard}>
      <h2>{currentData.title}</h2>
      <img src={currentData.thumbnail} alt={currentData.title} width={200} />
      <p>
        <b>Price: $</b>
        {currentData.price}
      </p>
      <p>
        <b>Description:</b> {currentData.description}
      </p>

      <StarRating rating={currentData.rating} />
    </article>
  )
}

export default ProductDetails
