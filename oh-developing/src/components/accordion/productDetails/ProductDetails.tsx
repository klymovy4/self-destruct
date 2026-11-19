import { useParams } from 'react-router'
import { useGetProductByIdQuery } from '../../../api/productsApi'
import { getErrorMessage } from '../../../utils/getErrorMessage'
import { skipToken } from '@reduxjs/toolkit/query/react'
import classes from './ProductDetails.module.scss'
import RatingInput from '../../ratingInput/RatingInput'
import { useState } from 'react'

const ProductDetails = () => {
  const { productId } = useParams()
  const id = Number(productId)
  const isValidId = Number.isInteger(id) && id > 0
  const [myRatings, setMyRatings] = useState<Record<number, number>>({})

  const { currentData, isFetching, error } = useGetProductByIdQuery(isValidId ? id : skipToken)

  const errorMessage = getErrorMessage(error)

  const changeRating = (value: number) => {
    setMyRatings((prev) => ({ ...prev, [id]: value }))
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
        value={myRatings[currentData.id] ?? 0}
        onChange={changeRating}
      />
    </article>
  )
}

export default ProductDetails
