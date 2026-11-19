import classes from './RatingInput.module.scss'
import { StarIcon } from '@phosphor-icons/react'

type RatingInputProps = {
  value: number
  name: any
  size?: number
  onChange: (value: number) => void
}

const RatingInput = ({ value, name, size = 12, onChange }: RatingInputProps) => {
  return (
    <fieldset className={classes.group}>
      <legend>Your rating</legend>
      {[1, 2, 3, 4, 5].map((star) => {
        return (
          <label key={star} className={classes.option}>
            <input
              name={name}
              value={star}
              className={classes.visuallyHidden}
              type='radio'
              checked={value === star}
              onChange={() => onChange(star)}
            />
            <StarIcon size={size} weight={star <= value ? 'fill' : 'regular'} aria-hidden />
            <span className={classes.visuallyHidden}>
              {star} {star === 1 ? 'star' : 'stars'}
            </span>
          </label>
        )
      })}
    </fieldset>
  )
}

export default RatingInput
