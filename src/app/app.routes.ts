import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { TodosEffects } from './features/todos/store/todos.effects';
import { todosReducer } from './features/todos/store/todos.reducer';
import { UsersStore } from './features/users/store/users.store';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/users/pages/users-page/users-page.component').then((m) => m.UsersPageComponent),
    providers: [UsersStore],
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./features/todos/pages/todos-page/todos-page.component').then(
        (m) => m.TodosPageComponent,
      ),
    providers: [provideState('todos', todosReducer), provideEffects(TodosEffects)],
  },
  { path: '**', redirectTo: '' },
];
