import { useParams } from 'react-router'
import { useGetProductByIdQuery } from '../../../api/productsApi'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { skipToken } from '@reduxjs/toolkit/query/react'
import classes from './ProductDetails.module.scss'
import RatingInput from '../../ratingInput/RatingInput'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { rated } from '../../../feature/rating/RatingSlice'

const ProductDetails = () => {
  const dispatch = useAppDispatch()

  const { productId } = useParams()
  const id = Number(productId)
  const isValidId = Number.isInteger(id) && id > 0
  const myRating = useAppSelector((state) => state.ratings[id] ?? 0)

  const { currentData, isFetching, error } = useGetProductByIdQuery(isValidId ? id : skipToken)

  const errorMessage = getErrorMessage(error)

  const changeRating = (value: number) => {
    dispatch(rated({ productId: id, rating: value }))
  }

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
      <p>
        <b>Rating: {currentData.rating}</b>
      </p>

      <RatingInput
        name={`rating-${currentData.id}`}
        size={21}
        value={myRating}
        onChange={changeRating}
      />
    </article>
  )
}

export default ProductDetails
