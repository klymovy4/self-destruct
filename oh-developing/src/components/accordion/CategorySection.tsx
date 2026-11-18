import { CaretRightIcon } from '@phosphor-icons/react'
import classes from './CategoryAccordion.module.scss'
import cx from 'clsx'
import { useGetProductByCategoryQuery } from '../../api/productsApi'
import { getErrorMessage } from '../../utils/getErrorMessage'

type CategorySectionProps = {
  category: { name: string; slug: string }
  onToggle: (id: string) => void
  isOpened: boolean
}

const CategorySection = (props: CategorySectionProps) => {
  const { category, isOpened, onToggle } = props

  const { data, isFetching, error } = useGetProductByCategoryQuery(category.slug, {
    skip: !isOpened,
  })

  const errorMessage = getErrorMessage(error)
  const panelId = `panel-${category.slug}`

  return (
    <li>
      <button
        type='button'
        aria-expanded={isOpened}
        aria-controls={`panel-${category.slug}`}
        onClick={() => onToggle(category.slug)}
      >
        <CaretRightIcon
          aria-hidden
          size={24}
          className={cx(classes.icon, isOpened && classes.rotate)}
        />
        <span>{category.name}</span>
      </button>
      <div id={panelId} className={cx(classes.panel, isOpened && classes.open)}>
        <div className={classes.panelInner}>
          {isFetching && <p className={classes.status}>Loading...</p>}
          {errorMessage && <p className={classes.status}>{errorMessage}</p>}

          {data && (
            <ul className={classes.products}>
              {data.products.map((product) => {
                return (
                  <li key={product.id} className={classes.product}>
                    <h4>Title: {product.title}</h4>
                    <img
                      loading='lazy'
                      src={product.thumbnail}
                      alt={product.title}
                      width={130}
                      height={130}
                    />
                    <div>
                      <p className={classes.productTitle}>{product.title}</p>
                      <p className={classes.productPrice}>Price: ${product.price}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </li>
  )
}

export default CategorySection
