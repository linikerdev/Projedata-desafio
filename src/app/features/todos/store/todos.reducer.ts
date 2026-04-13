import { createReducer, on } from '@ngrx/store';
import { Todo } from '../models/todo.model';
import { TodosActions } from './todos.actions';

export interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export const initialTodosState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

export const todosReducer = createReducer(
  initialTodosState,
  on(TodosActions.loadTodos, (state): TodosState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosActions.loadTodosSuccess, (state, { todos }): TodosState => ({
    ...state,
    loading: false,
    todos,
    error: null,
  })),
  on(TodosActions.loadTodosError, (state, { error }): TodosState => ({
    ...state,
    loading: false,
    error,
  })),
  on(TodosActions.toggleTodoComplete, (state, { id }): TodosState => ({
    ...state,
    todos: state.todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    ),
  })),
);
