import { createContext, useContext, useReducer } from 'react'
import type { Action, Todo } from '../types/todo'

const initialTodos: Todo[] = [
  { id: 1, message: 'Walk the dog', done: false },
  { id: 2, message: 'Water the plants', done: false },
  { id: 3, message: 'Wash the dishes', done: true },
]

const todosReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case 'toggled':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
    case 'added': {
      const lastId = state[state.length - 1]?.id ?? 0
      return [...state, { id: lastId + 1, done: false, message: action.message }]
    }
    case 'deleted':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

type TodosContextValue = {
  todos: Todo[]
  dispatch: React.Dispatch<Action>
}

const TodosContext = createContext<TodosContextValue | null>(null)

export const TodosProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos)

  return <TodosContext.Provider value={{ todos, dispatch }}>{children}</TodosContext.Provider>
}

export const useTodos = () => {
  const context = useContext(TodosContext)

  if (!context) {
    throw new Error('No context')
  }

  return context
}
