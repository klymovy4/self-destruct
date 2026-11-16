export type Todo = {
  id: number
  message: string
  done: boolean
}

export type Action =
  | { type: 'added'; message: string }
  | { type: 'deleted'; id: number }
  | { type: 'toggled'; id: number }
