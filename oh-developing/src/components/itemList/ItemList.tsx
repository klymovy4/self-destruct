import { useState } from 'react'

import TodoItem from '../todoItem/TodoItem'
import { useTodos } from '../../context/TodosContext'

const ItemList = () => {
  const [value, setValue] = useState('')
  const { todos, dispatch } = useTodos()

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const text = value.trim()
    if (!text) return

    dispatch({ type: 'added', message: text })
    setValue('')
  }

  const doneCount = todos.filter((t) => t.done).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h3>Todo list</h3>
        {!todos.length ? (
          <span>No tasks yet</span>
        ) : (
          <span>
            Done: {doneCount} of {todos.length}
          </span>
        )}
      </div>

      <form onSubmit={submitForm}>
        <label htmlFor='new-task'>New task</label>

        <input
          id='new-task'
          type='text'
          placeholder='Add your task'
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
      <ul>
        {todos.map((todo) => {
          return <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
        })}
      </ul>
    </div>
  )
}

export default ItemList
