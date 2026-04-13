import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.reducer';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const selectAllTodos = createSelector(selectTodosState, (s) => s.todos);

export const selectPendingTodos = createSelector(selectAllTodos, (todos) =>
  todos.filter((t) => !t.completed),
);

export const selectTodosLoading = createSelector(
  selectTodosState,
  (s) => s.loading,
);

export const selectTodosError = createSelector(selectTodosState, (s) => s.error);
