import { useState } from 'react'
import classes from './CategoryAccordion.module.scss'

import CategorySection from './CategorySection'
import { useGetCategoriesQuery } from '../../api/productsApi'
import { Outlet } from 'react-router'

const CategoryAccordion = () => {
  const [openedSectionIds, setOpenedSectionIds] = useState<string[]>([])
  const [isSingleMode, setIsSingleMode] = useState(true)
  const { data: categories = [] } = useGetCategoriesQuery('products')

  const toggleAccordion = (sectionId: string) => {
    setOpenedSectionIds((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId)
      }

      return isSingleMode ? [sectionId] : [...prev, sectionId]
    })
  }

  return (
    <div className={classes.layout}>
      <section className={classes.accordion}>
        <h2>Categories</h2>

        <label>
          <input
            type='checkbox'
            checked={isSingleMode}
            onChange={() => {
              const nextMode = !isSingleMode
              if (nextMode) {
                setOpenedSectionIds((prev) => prev.slice(-1))
              }

              setIsSingleMode((prev) => !prev)
            }}
          />
          <span>One opened only</span>
        </label>
        <ul className={classes.list}>
          {categories.map((category) => {
            const isOpened = openedSectionIds.includes(category.slug)

            return (
              <CategorySection
                key={category.slug}
                category={category}
                onToggle={toggleAccordion}
                isOpened={isOpened}
              />
            )
          })}
        </ul>
      </section>
      <aside className={classes.details}>
        <Outlet />
      </aside>
    </div>
  )
}

export default CategoryAccordion
