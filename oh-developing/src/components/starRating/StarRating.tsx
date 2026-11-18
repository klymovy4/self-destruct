import { StarIcon } from '@phosphor-icons/react'
import classes from './StarRating.module.scss'

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className={classes.rating} role='img' aria-label={`Rating ${rating.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1)
        const percent = fill * 100

        return (
          <span key={i} className={classes.star}>
            <StarIcon weight='regular' aria-hidden />
            <span className={classes.fill} style={{ width: `${percent}%` }}>
              <StarIcon weight='fill' aria-hidden />
            </span>
          </span>
        )
      })}
    </div>
  )
}

export default StarRating
