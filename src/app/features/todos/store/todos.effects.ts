import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TodosApiService } from '../services/todos-api.service';
import { TodosActions } from './todos.actions';

@Injectable()
export class TodosEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TodosApiService);

  readonly loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      switchMap(() =>
        this.api.getTodos().pipe(
          map((todos) => TodosActions.loadTodosSuccess({ todos })),
          catchError((err: unknown) =>
            of(
              TodosActions.loadTodosError({
                error:
                  err instanceof Error ? err.message : 'Não foi possível carregar.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
