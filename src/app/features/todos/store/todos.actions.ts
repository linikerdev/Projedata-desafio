import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const TodosActions = createActionGroup({
  source: 'Todos',
  events: {
    'Load Todos': emptyProps(),
    'Load Todos Success': props<{ todos: Todo[] }>(),
    'Load Todos Error': props<{ error: string }>(),
    'Toggle Todo Complete': props<{ id: number }>(),
  },
});
