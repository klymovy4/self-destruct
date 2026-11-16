import type { Action, Todo } from '../../types/todo'

type TodoItemProps = {
  todo: Todo
  dispatch: React.Dispatch<Action>
}

const TodoItem = ({ todo, dispatch }: TodoItemProps) => {
  return (
    <li>
      <label>
        <input
          type='checkbox'
          checked={todo.done}
          onChange={() => dispatch({ type: 'toggled', id: todo.id })}
        />
        <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.message}</span>
      </label>

      <button
        aria-label={`Delete ${todo.message}`}
        onClick={() => dispatch({ type: 'deleted', id: todo.id })}
      >
        Delete
      </button>
    </li>
  )
}

export default TodoItem


